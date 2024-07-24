import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const ImageUploader = ({ maxImages, name, onFilesSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleFileChange = (e) => {
    const files = e.target.files
    const images = []
    const videos = []
    const maxVideos = 1

    const handleFileUpload = (file) => {
      if (file.type.startsWith('image/')) {
        images.push(file)
        if (images.length > maxImages) {
          images.pop()
        }
      } else if (file.type.startsWith('video/')) {
        videos.push(file)
        if (videos.length > maxVideos) {
          videos.pop()
        }
      }
    }

    for (const file of files) {
      handleFileUpload(file)
    }

    setSelectedFiles([...images, ...videos])
    onFilesSelect([...images, ...videos])
  }

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          name={name}
        />
      </Form.Group>
      <div>
        {selectedFiles.map((file, index) =>
          file.type.startsWith('image/') ? (
            <img
              key={`image-${index}`}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="img-fluid mb-3 shadow rounded-2"
              style={{ maxWidth: '150px', marginRight: '10px' }}
            />
          ) : (
            <video
              key={`video-${index}`}
              src={URL.createObjectURL(file)}
              controls
              className="img-fluid mb-3 shadow rounded-2"
              style={{ maxWidth: '150px', marginRight: '10px' }}
            >
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>
    </div>
  )
}

export default ImageUploader
