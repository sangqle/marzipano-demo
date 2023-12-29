import React, { useEffect, useRef } from 'react';

function createImageHotspotElement(hotspot: any) {
  var wrapper = document.createElement("div");
  wrapper.classList.add("hotspot");
  wrapper.classList.add("w-[600px]");
  wrapper.classList.add("h-[600px]");
  var icon = document.createElement("img");
  icon.src = "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-290923-030426.jpg";
  icon.height = 600;
  icon.width = 600;
  wrapper.appendChild(icon);
  return wrapper;
}

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

          const urlPrefix = "//localhost:3000/tiles";
          const source = marzipano.ImageUrlSource.fromString(
            `${urlPrefix}/${'0-panara-1'}/{z}/{f}/{y}/{x}.jpg`,
            { cubeMapPreviewUrl: `${urlPrefix}/${id}/panara-1.jpg` }
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

          // Create info hotspots.
          data.imageHotspots.forEach(function (hotspot: any) {
            var element = createImageHotspotElement(hotspot);
            scene.hotspotContainer().createHotspot(element,
              { yaw: hotspot.yaw, pitch: hotspot.pitch },
              { perspective: { radius: 1700, extraTransforms: "rotateX(5deg)" } }
            );
          });

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

  return (
    <div className='pano-container h-[1000px] w-[100vw]' ref={panoRef}>
    </div>)
}

export default Pano;
