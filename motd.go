package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"runtime"
	"strings"
	"time"
)

// App struct
type Motd struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewMotd() *Motd {
	return &Motd{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (m *Motd) startup(ctx context.Context) {
	m.ctx = ctx
}

type Motds struct {
	Motds []MotdEntries `json:"motds"`
}

type MotdEntries struct {
	Quote  string `json:"quote"`
	Author string `json:"author"`
}

func (m *Motd) Motd() [3]string {
	jsonmotds := m.loadJsonFile(cfg.MotdFilePath)

	var motds Motds

	backupEntry := `{
		"motds": [
			{
				"quote": "Houston, we have a Problem.",
				"author": "Apollo 13"
			}
		]
	}`

	// check if there's an unmarshal error and if so, load backup
	if err := json.Unmarshal(jsonmotds, &motds); err != nil {
		jsonmotds := []byte(backupEntry)
		json.Unmarshal(jsonmotds, &motds)
	}

	// check if we have valid motds and if not, load backup
	if len(motds.Motds) == 0 {
		jsonmotds := []byte(backupEntry)
		json.Unmarshal(jsonmotds, &motds)
	}

	lastStartDate, daysSinceLastStart := m.calcLastMotdStartDate(motds.Motds)

	rand.Seed(lastStartDate.UnixNano())
	rand.Shuffle(len(motds.Motds), func(i, j int) {
		motds.Motds[i], motds.Motds[j] = motds.Motds[j], motds.Motds[i]
	})
	//Debug
	//fmt.Printf("StartDate: %s, DaysSinceLastStart: %d \n", lastStartDate, daysSinceLastStart)

	var motd [3]string
	motd[0] = motds.Motds[daysSinceLastStart].Quote
	motd[1] = motds.Motds[daysSinceLastStart].Author
	motd[2] = fmt.Sprint((strings.Count(motd[0], "") - 1))
	return motd
}

func (m *Motd) Platform() string {
	switch runtime.GOOS {
	case "darwin":
		return "darwin"
	case "windows":
		return "windows"
	case "linux":
		return "linux"
	default:
		return ""
	}
}

func (m *Motd) Speed() float64 {
	println(cfg.Speed)
	println(cfg.MotdFilePath)
	return cfg.Speed
}

func (m *Motd) loadJsonFile(file string) []byte {
	// Open our jsonFile
	jsonFile, err := os.Open(file)
	// if we os.Open returns an error then handle it
	if err != nil {
		return []byte("")
	}

	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	return byteValue
}

func (m *Motd) calcDaysToNow(startyear int, startmonth int, startday int) int {
	year, month, day := time.Now().Date()

	today := time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
	startDate := time.Date(startyear, time.Month(startmonth), startday, 0, 0, 0, 0, time.UTC)

	difference := today.Sub(startDate)

	return int(difference.Hours() / 24)
}

func (m *Motd) calcLastMotdStartDate(motdEntries []MotdEntries) (time.Time, int) {
	daysSinceStart := m.calcDaysToNow(2022, 6, 3)
	motdNumberOfEntries := len(motdEntries)
	var motdCycles int = 0
	if daysSinceStart >= motdNumberOfEntries {
		motdCycles = daysSinceStart / motdNumberOfEntries
	}
	daysSinceLastStart := time.Duration(daysSinceStart - (motdCycles * motdNumberOfEntries))

	// Debug
	//fmt.Printf("Days since start: %d, Entries: %d = Cycles: %d, Days since last start: %d \n", daysSinceStart, len(motdEntries), motdCycles, daysSinceLastStart)

	year, month, day := time.Now().Date()
	today := time.Date(year, month, day, 0, 0, 0, 0, time.UTC)

	lastStartDate := today.Add(-time.Hour * 24 * daysSinceLastStart)

	return lastStartDate, int(daysSinceLastStart)
}
