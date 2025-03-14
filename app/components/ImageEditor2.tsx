import { useRef, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import * as fabric from "fabric";
import html2canvas from "html2canvas";

const ImageEditor = ({
  faceImage,
  bodyImage,
  skinTone,
  SkitToneImage,
  headBackImage,
  backgroundImg,
  setStep,
  step,
}) => {
  const canvasBodyRef = useRef(null);
  const canvasSkinToneRef = useRef(null);
  const canvasHeadBackRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef(null);

  const defaultBodyImage = bodyImage || "/images/SN-044_copy_2_preview.png";
  const defaultSkitToneImage =
    SkitToneImage || "/images/Snugzy_Shape_preview.png";
  const defaultHeadBackImage = headBackImage || "/images/headblack_preview.png";
  const defaultFaceImage = faceImage;
  const defaultSkinTone = skinTone || "grayscale(100%)";

  const width = 200;
  const height = 200;

  useEffect(() => {
    const drawImageOnCanvas = (canvasRef, imageSrc, filter = "none") => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = filter;

        ctx.drawImage(image, 0, 0, width, height);
      };
    };

    drawImageOnCanvas(canvasBodyRef, defaultBodyImage);
    drawImageOnCanvas(canvasSkinToneRef, defaultSkitToneImage, defaultSkinTone);
    drawImageOnCanvas(canvasHeadBackRef, defaultHeadBackImage);
  }, [
    defaultBodyImage,
    defaultSkitToneImage,
    defaultSkinTone,
    defaultHeadBackImage,
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasInstance.current = new fabric.Canvas(canvasRef.current, {
      width: 250,
      height: 500,
      preserveObjectStacking: true,
    });

    if (defaultFaceImage) {
      const imageElement = new Image();
      imageElement.src = defaultFaceImage;
      imageElement.crossOrigin = "anonymous";
      imageElement.onload = () => {
        const image = new fabric.Image(imageElement);
        image.scaleToWidth(canvasInstance.current?.width);
        image.scaleToHeight(canvasInstance.current?.height / 1.6);
        canvasInstance.current?.add(image);
        canvasInstance.current!.centerObject(image);
        canvasInstance.current?.setActiveObject(image);
      };
    }

    return () => {
      if (canvasInstance.current) {
        (canvasInstance.current as fabric.Canvas).dispose();
      }
    };
  }, [defaultFaceImage, backgroundImg]);

  const downloadCanvasAsImage = async (event: MouseEvent) => {
    if (
      canvasRef.current &&
      !canvasRef.current.contains(event.target as Node)
    ) {
      // Hide the cursor when clicking outside the canvas
      (canvasRef.current as HTMLCanvasElement).style.cursor = "none";

      setTimeout(async () => {
        if (!containerRef.current) return;
        const canvasImage = await html2canvas(containerRef.current, {
          useCORS: true,
          allowTaint: false,
        });
        const link = document.createElement("a");
        link.href = canvasImage.toDataURL("image/png");
        link.download = "facepillow.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setStep(0);
      }, 1000);
    }
  };
 
  return (
    <div className="flex flex-col border-r border-r-gray-500 items-center justify-center w-[50%] max-sm:w-full  z-0 min-h-[90vh]">
      <div
        className="relative w-full flex justify-center items-center bg-contain bg-center bg-no-repeat"
        style={{ height: "60vh", minHeight: "60vh", maxHeight: "auto" }}
      >
        <div
          ref={containerRef}
          className="relative w-[380px] h-[650px] flex justify-center items-start top-0"
        >
          <canvas
            className="absolute top-0 w-full h-full z-10"
            ref={canvasHeadBackRef}
            width={width}
            height={height}
          ></canvas>

          {faceImage ? (
            <canvas
              id="canvasRef"
              className="top-0 absolute   max-h-[370px]  z-40"
              ref={canvasRef}
              width={width}
              height={height}
            ></canvas>
          ) : (
            <img
              className="top-10 absolute   max-h-[250px]  z-40"
              src="/images/Layer_40_face_preview.png"
              alt="faceimage"
            />
          )}
          <canvas
            className="absolute w-full h-full"
            ref={canvasSkinToneRef}
            width={width}
            height={height}
          ></canvas>
          <canvas
            className="absolute bottom-0 left-0 w-full h-full"
            ref={canvasBodyRef}
            width={width}
            height={height}
          ></canvas>
        </div>
      </div>
      {step === 7 && (
        <div className="flex gap-4 mt-10 absolute right-10 bottom-10 max-sm:bottom-0">
          <button
            onClick={downloadCanvasAsImage}
            className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FaCartPlus className="inline-block mr-2" /> Add to Basket
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
