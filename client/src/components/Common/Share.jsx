import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaPinterestP, FaShare, FaWhatsapp } from 'react-icons/fa'

const ShareDropdown = () => {
    const {t, i18n} =useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleShare = (platform) => {
    const shareUrl = window.location.href
    const encodedUrl = encodeURIComponent(shareUrl)

    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedUrl}`
        break
      default:
        return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false) // Close the dropdown after sharing
  }

  return (
    <div className="dropdown ">
      <button
        className="btn shadow-sm bg-primary-white dropdown-toggle"
        type="button"
        dir={i18n.dir()}
        style={{padding:'9px 34px'}}
        id="dropdownMenuButton"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <FaShare size={20} />
        <span className="mx-2">Share</span>
      </button>
      <div
        className={`dropdown-menu ${isOpen ? 'show' : ''}`}
        aria-labelledby="dropdownMenuButton"
      >
        <button
          className="dropdown-item"
          onClick={() => handleShare('facebook')}
        >
          <FaFacebookF size={20} />
          <span className="ms-2">Facebook</span>
        </button>
        <button
          className="dropdown-item"
          onClick={() => handleShare('pinterest')}
        >
          <FaPinterestP size={20} />
          <span className="ms-2">Pinterest</span>
        </button>
        <button
          className="dropdown-item"
          onClick={() => handleShare('whatsapp')}
        >
          <FaWhatsapp size={20} />
          <span className="ms-2">WhatsApp</span>
        </button>
      </div>
    </div>
  )
}

export default ShareDropdown
