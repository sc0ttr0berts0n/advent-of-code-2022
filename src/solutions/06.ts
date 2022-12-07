import InputParser from '../utils/input-parser';

enum EMarkerType {
    START_OF_PACKET,
    START_OF_MESSAGE,
}

const parser = new InputParser('06');
const datastream = parser.toRaw();

const getMarkers = (type: EMarkerType) => {
    const startPoint = type === EMarkerType.START_OF_PACKET ? 3 : 13;
    for (let i = startPoint; i < datastream.length; i++) {
        const chars = datastream.slice(i - startPoint, i + 1).split('');
        const set = new Set(chars);

        if (chars.length === set.size) return i + 1;
    }
};

const markerIndex = getMarkers(EMarkerType.START_OF_MESSAGE);

console.log(markerIndex);

debugger;
