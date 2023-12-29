import React, { useEffect, useRef } from 'react';

function Pano({ data }: any) {
  const panoRef = useRef(null);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      import('marzipano').then((marzipano) => {
        const {
          settings: { mouseViewMode },
          scenes,
        } = data;

        const viewerOpts = {
          controls: { mouseViewMode },
        };

        const viewer = new marzipano.Viewer(panoRef.current, viewerOpts);
        const panoScenes = scenes.map((data: any) => {
          const { id, initialViewParameters, levels, faceSize } = data;

          const urlPrefix = "//www.marzipano.net/media";
          const source = marzipano.ImageUrlSource.fromString(
            `${urlPrefix}/${id}/{z}/{f}/{y}/{x}.jpg`,
            { cubeMapPreviewUrl: `${urlPrefix}/${id}/preview.jpg` }
          );

          const limiter = marzipano.RectilinearView.limit.traditional(
            faceSize,
            (100 * Math.PI) / 180,
            (120 * Math.PI) / 180
          );
          const view = new marzipano.RectilinearView(initialViewParameters, limiter);
          const geometry = new marzipano.CubeGeometry(levels);

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
      });
    }
  }, [data]);

  console.log(panoScenes);

  return (
    <div className='pano-container h-[1000px] w-[100vw]' ref={panoRef}>
    </div>)
}

export default Pano;
