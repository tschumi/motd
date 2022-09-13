package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/knadh/koanf"
	"github.com/knadh/koanf/parsers/toml"
	"github.com/knadh/koanf/providers/file"
)

type Config struct {
	MotdFilePath string
	Speed        float64
}

func LoadConfig(filename string) (config Config) {
	koanf := koanf.New(".")

	// Load JSON config.
	if err := koanf.Load(file.Provider(getConfigPath(filename)), toml.Parser()); err != nil {
		config.MotdFilePath = "."
		config.Speed = 2
	} else {
		config.MotdFilePath = koanf.String("motdfilepath")
		config.Speed = koanf.Float64("speed")
	}

	return
}

func getConfigPath(filename string) string {
	path, err := os.Executable()

	if err != nil {
		log.Println(err)
	}

	osSeparator := string(os.PathSeparator)
	file := path + osSeparator + filename

	// as it is os (and dev) dependent, where exactly the config file is, we go one dir up until we find it
	count := strings.Count(path, "") - 1
	for count > 1 {
		pathExists, err := exists(file)

		if err != nil {
			log.Printf("pathExist Error: %s", err)
		}

		if pathExists {
			break
		}

		path = filepath.Clean(filepath.Join(path, ".."))
		count = strings.Count(path, "") - 1

		if count > 1 {
			file = path + osSeparator + filename
		} else {
			file = filename
		}
	}

	return file
}

// Returns whether the given file or directory exists
func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}
