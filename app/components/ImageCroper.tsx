import React, { useRef, useState, useEffect } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { FaSearchPlus, FaSearchMinus, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaRedo, FaCrop } from 'react-icons/fa';

interface ImageCropperProps {
    src: string;
    onCropChange?: (croppedImage: string) => void;
    onCrop?: (croppedImage: string) => void;
    className?: string;
    setUploadedPhoto?: React.Dispatch<React.SetStateAction<any>>;
    setCropedImage?: React.Dispatch<React.SetStateAction<any>>;
    setStep?: React.Dispatch<React.SetStateAction<number>>;
  }

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCropChange, onCrop, className, setUploadedPhoto, setCropedImage,setStep }) => {
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    if (cropperRef.current) {
      // console.log("Cropper is available:", cropperRef.current);
    }
  }, []);


  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const croppedDataUrl = canvas.toDataURL('image/png');
        setCropedImage(croppedDataUrl);
        localStorage.setItem("cropedImage", JSON.stringify(croppedDataUrl));
        setStep(5)
        if (onCropChange) onCropChange(croppedDataUrl);
        if (onCrop) onCrop(croppedDataUrl);
      }
    }
  };


  const resetCropper = () => {
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  const handleChangePhoto = () => {
    if (setUploadedPhoto) {
      setUploadedPhoto(null); // Reset uploaded photo if available
    }
    setStep(0)
  };

  return (
    <div className="w-[50%] max-sm:w-full justify-center flex flex-col items-center space-y-4 min-h-full max-sm:mb-5">
      <Cropper
        ref={cropperRef}
        src={src}
        className={className || 'w-full h-96 border border-gray-300'}
      />

      {/* Controls */}
      <div className="flex space-x-2 border border-blue-200 rounded-md p-5 ">
       
        <button onClick={resetCropper} className="px-2 py-1 bg-red-100 bg-opacity-50 text-red-900 hover:text-white text-sm rounded hover:bg-red-800 border border-red-800 flex justify-center items-center gap-2">
          <FaRedo /> 
        </button>
        <button onClick={handleCrop} className="px-2 py-1 bg-blue-100 bg-opacity-50 text-blue-500 hover:text-white text-sm rounded hover:bg-blue-800 border border-blue-800 flex justify-center items-center gap-2">
         <FaCrop className='font-normal'/> 
        </button>
        <button onClick={handleChangePhoto} className="px-2 py-1 bg-gray-600 text-gray-100 hover:text-white text-sm rounded hover:bg-gray-800 border border-gray-800 flex justify-center items-center gap-2">
          Change Photo
        </button>
      </div>

    </div>
  );
};

export default ImageCropper;
