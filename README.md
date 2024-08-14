# MPT Example
A boilerplate example of Modular Pink Trombone: polyphonic browser-based voice synthesis based on the original [Pink Trombone](https://dood.al/pinktrombone/) made by Neil Thapen (MIT License). A copy of the original code and the license are included in this repo, as per the license specifications.

## Setup
```git clone``` this repo
```git submodule init```, ```git submodule update```
```npm install```
```npm run dev``` to run development server, or:
```npm run build``` to build production files

## Usage
- Enable audio using the button at the top
- Choose your number of voices. Adding too many will causes audio processing gaps! Max # depends on CPU specs.
- Adjust the frequency and intensity (volume) of voices. Voices are silent by default until you increase the intensity.
- Click around a vocal tract UI to "speak" with the corresponding voice.
