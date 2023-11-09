package fishpop_simulation

import (
	"github.com/umbralcalc/stochadex/pkg/phenomena"
	"github.com/umbralcalc/stochadex/pkg/simulator"
)

// FishPopulationIteration defines an iteration for a model of fish population time evolution
// in a networked river system which was defined in this chapter of the book Worlds Of Observation:
// https://umbralcalc.github.io/worlds-of-observation/angling_for_freshwater_fish/chapter.pdf
type FishPopulationIteration struct {
	coxProcess *phenomena.CoxProcessIteration
}

func (f *FishPopulationIteration) Configure(
	partitionIndex int,
	settings *simulator.LoadSettingsConfig,
) {
	f.coxProcess.Configure(partitionIndex, settings)
}

func (f *FishPopulationIteration) Iterate(
	otherParams *simulator.OtherParams,
	partitionIndex int,
	stateHistories []*simulator.StateHistory,
	timestepsHistory *simulator.CumulativeTimestepsHistory,
) []float64 {
	// do something
	return []float64{}
}
