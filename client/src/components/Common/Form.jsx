import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ContactRequest, propertyRequest } from '../../Api/ApiCalls'

const Form = ({ type }) => {
  const { t, i18n } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const loadingToastId = toast.loading('Submitting your data...')
    try {
      if (type === 'contact') {
        await ContactRequest(data)
      } else await propertyRequest(data)

      toast.update(loadingToastId, {
        render: 'Successfully submitted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })
    } catch (error) {
      console.error('Error submitting data:', error)
      toast.update(loadingToastId, {
        render:
          error.response?.data?.message ||
          'Failed to submit. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-developer-form w-100 p-2"
    >
      <h2 className="text-center mb-2 fs-4">{t('meetingWithTeam')}</h2>
      <div className="d-flex justify-content-center align-items-center">
        <p className="w-75 text-center">{t('meetingText')}</p>
      </div>
      <div className="d-flex flex-column gap-2">
        <input
          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          type="text"
          name="firstName"
          id="firstName"
          placeholder={t('contactForm.inputName')}
          {...register('firstName', {
            required: t('contactForm.inputNameRequired'),
          })}
        />
        {errors.firstName && (
          <div className="invalid-feedback">{errors.firstName.message}</div>
        )}

        <input
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          type="email"
          name="email"
          id="email"
          placeholder={t('contactForm.inputEmail')}
          {...register('email', {
            required: t('contactForm.inputEmailRequired'),
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}

        <input
          className={`form-control mb-2 ${errors.phone ? 'is-invalid' : ''}`}
          type="tel"
          name="phone"
          id="phone"
          dir={i18n.dir()}
          placeholder={t('contactForm.inputPhone')}
          {...register('phone', {
            required: t('contactForm.inputPhoneRequired'),
          })}
        />
        {errors.phone && (
          <div className="invalid-feedback">{errors.phone.message}</div>
        )}
      </div>

      <textarea
        name="comment"
        className={`form-control mb-2 ${errors.comment ? 'is-invalid' : ''}`}
        style={{ height: '175px' }}
        cols="45"
        rows="8"
        placeholder={t('contactForm.yourMessage')}
        aria-required="true"
        {...register('message', {
          required: t('contactForm.yourMessageRequired'),
        })}
      ></textarea>
      {errors.comment && (
        <div className="invalid-feedback">{errors.comment.message}</div>
      )}

      <button type="submit" className="btn button-primary mb-0">
        {t('contactForm.send')}
      </button>
    </form>
  )
}

export default React.memo(Form)
