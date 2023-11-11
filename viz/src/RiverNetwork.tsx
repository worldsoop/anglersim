import React, { useEffect, useState, useRef, useMemo } from 'react';
import { DashboardPartitionState } from './dashboard_state';
import rodImage from './assets/fishing-rod.png';
import './App.css';


const RiverNetwork: React.FC = () => {
  const [data, setData] = useState<{
    cumulativeTimesteps: number;
    partitionIndex: number;
    state: number[];
  }[]>([]);
  const [selectedPartitionIndex, setSelectedPartitionIndex] = useState<string | null>(null);

  // create a memoized version of a function that generates the datasets
  const datasets = useMemo(() => {
    const result: { [partitionIndex: string]: {
      label: string;
      data: {
        time: number;
        state: number;
      }[];
    }[]} = {};

    data.forEach((datum) => {
      for (let index = 0; index < datum.state.length; index++) {
        const partitionIndexString = String(datum.partitionIndex);

        if (!(partitionIndexString in result)) {
          result[partitionIndexString] = [];
        }

        if (!(index in result[partitionIndexString])) {
          result[partitionIndexString].push({
            label: `Element ${index}`,
            data: [{
              time: datum.cumulativeTimesteps,
              state: datum.state[index],
            }],
          });
        } else {
          result[partitionIndexString][index].data.push({
            time: datum.cumulativeTimesteps,
            state: datum.state[index],
          })
        }
      }
    });

    return result;
  }, [data]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:2112/dashboard');
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = async (event: MessageEvent) => {
      const decodedMessage = DashboardPartitionState.deserializeBinary(event.data);
      setData((prevData) => [
        {
          cumulativeTimesteps: decodedMessage.cumulative_timesteps, 
          partitionIndex: decodedMessage.partition_index, 
          state: decodedMessage.state
        },
      ]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Implement a function to update the selected partitionIndex
  const handlePartitionIndexChange = (partitionIndex: string) => {
    setSelectedPartitionIndex(partitionIndex);
  };

  return (
    <div>
      <div>
        <div>
          {Object.entries(datasets).map(([k, v]) => (
            <button
              key={k}
              onClick={() => handlePartitionIndexChange(k)}
            >
              Show Partition {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiverNetwork;