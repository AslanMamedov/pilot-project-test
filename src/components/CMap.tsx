import { FC, memo, useEffect, useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { WKT } from 'ol/format';
import { lineString } from '../libs/lineString';

interface ICMapProps {
	wkt: string;
}

const CMap: FC<ICMapProps> = memo(({ wkt }) => {
	const mapTargetElement = useRef<HTMLDivElement | null>(null);
	const coordinate = lineString(wkt);
	useEffect(() => {
		const LINESTRING = `LINESTRING (${wkt ? coordinate[0] : 0} ${wkt ? coordinate[1] : 0}, ${wkt ? coordinate[2] : 0} ${
			wkt ? coordinate[3] : 0
		})`;
		const format = new WKT();
		const feature = format.readFeature(LINESTRING, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857',
		});
		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features: [feature],
			}),
		});
		const map = new Map({
			layers: [new TileLayer({ source: new OSM() }), vectorLayer],
			controls: [],
			view: new View({
				center: fromLonLat([coordinate[0], coordinate[1]]),
				zoom: 18,
			}),
		});

		map.setTarget(mapTargetElement.current || '');
		return () => map.setTarget('');
	}, [coordinate]);

	return (
		<div
			ref={mapTargetElement}
			style={{
				width: '100%',
				height: '560px',
				position: 'relative',
			}}
		/>
	);
});

export default CMap;
