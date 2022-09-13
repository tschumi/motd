package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

// Load the config
var cfg = LoadConfig("config.toml")

func main() {
	// Create an instance of the app structure
	motd := NewMotd()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "",
		Width:            600,
		Height:           100,
		DisableResize:    true,
		AlwaysOnTop:      true,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        motd.startup,
		StartHidden:      true,
		Bind: []interface{}{
			motd,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
