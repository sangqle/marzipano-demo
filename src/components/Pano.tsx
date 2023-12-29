'use client'

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'

const Marzipano = dynamic(
  () => import('marzipano'),
  { ssr: false }
);

function Pano({ data }: any) {
  const panoRef = React.useRef(null);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const {
        settings: { mouseViewMode },
        scenes,
      } = data;

      const viewerOpts = {
        controls: { mouseViewMode },
      };

      const viewer = new Marzipano.Viewer(panoRef.current, viewerOpts);
      const panoScenes = scenes.map((data: any) => {
        const { id, initialViewParameters, levels, faceSize } = data;

        const urlPrefix = "//www.marzipano.net/media";
        const source = Marzipano.ImageUrlSource.fromString(
          `${urlPrefix}/${id}/{z}/{f}/{y}/{x}.jpg`,
          { cubeMapPreviewUrl: `${urlPrefix}/${id}/preview.jpg` }
        );

        const limiter = Marzipano.RectilinearView.limit.traditional(
          faceSize,
          (100 * Math.PI) / 180,
          (120 * Math.PI) / 180
        );
        const view = new Marzipano.RectilinearView(initialViewParameters, limiter);
        const geometry = new Marzipano.CubeGeometry(levels);

        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true,
        });

        var imgHotspot = document.createElement("img");
        imgHotspot.src = "/next.svg";
        imgHotspot.classList.add("hotspot");

        var position = { yaw: Math.PI / 4, pitch: Math.PI / 8 };
        scene.hotspotContainer().createHotspot(imgHotspot, position);

        return {
          data: data,
          scene: scene,
          view: view,
        };
      });

      panoScenes[0].scene.switchTo();
    }
  }, [data]);

  return <div className='pano-container' ref={panoRef}></div>;
}

export default Pano;
