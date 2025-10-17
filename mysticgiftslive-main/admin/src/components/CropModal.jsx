import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../lib/cropImageUtil'

const portraitAspect = 4 / 5
const landscapeAspect = 5 / 4

const CropModal = ({ image, onClose, onCrop }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [minZoom, setMinZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isPortrait, setIsPortrait] = useState(true)
  const aspect = isPortrait ? portraitAspect : landscapeAspect

  const onMediaLoaded = useCallback((mediaSize) => {
    const { width, height } = mediaSize
    // Crop box is always width: 100, height: 100/aspect (normalized units)
    const cropBoxWidth = 100
    const cropBoxHeight = 100 / aspect

    // Calculate the minimum zoom so the image is fully contained in the crop area
    const minZoomVal = Math.max(
      cropBoxWidth / width,
      cropBoxHeight / height
    )
    // Start a little bigger for visibility (e.g. 10% bigger, but not more than 2x)
    const initialZoom = Math.min(minZoomVal * 1.1, 2)
    setMinZoom(minZoomVal)
    setZoom(initialZoom)
  }, [aspect])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels)
    onCrop(croppedImage)
    onClose()
  }

  const handleToggleAspect = () => {
    setIsPortrait((prev) => !prev)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-white p-4 rounded shadow-lg w-[90vw] max-w-md">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleToggleAspect}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold"
          >
            {isPortrait ? 'Switch to Landscape' : 'Switch to Portrait'}
          </button>
        </div>
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={onMediaLoaded}
            restrictPosition={false}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <input
            type="range"
            min={minZoom}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1"
          />
          <button onClick={handleCrop} className="bg-blue-600 text-white px-4 py-2 rounded">Crop & Save</button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default CropModal