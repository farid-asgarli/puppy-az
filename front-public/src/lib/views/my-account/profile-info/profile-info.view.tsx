'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { IconUser, IconMail, IconCamera, IconDeviceFloppy, IconX, IconLoader2, IconTrash } from '@tabler/icons-react';
import { Heading } from '@/lib/primitives/typography';
import { updateProfileAction, uploadProfilePictureAction, deleteProfilePictureAction } from '@/lib/auth/actions';
import type { UserProfileDto, UpdateUserProfileCommand } from '@/lib/api/types/auth.types';
import TextInput from '@/lib/form/components/text/text-input.component';
import ReadOnlyInput from '@/lib/form/components/text/read-only-input.component';
import PhoneInput from '@/lib/form/components/phone/phone-input.component';
import Button from '@/lib/primitives/button/button.component';
import { IconButton } from '@/lib/primitives/icon-button';
import { useRouter } from '@/i18n';
import { StatusMessage } from '@/lib/components/views/my-account/status-message/status-message.component';
import { PageHeader, InfoBanner } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils/date-utils';
import { formatPhoneForInput } from '@/lib/utils/phone-utils';
import { useAuth } from '@/lib/hooks/use-auth';

interface ProfileInfoViewProps {
  profile: UserProfileDto;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl?: string;
}

export default function ProfileInfoView({ profile }: ProfileInfoViewProps) {
  const t = useTranslations('myAccountPages.profileInfo');
  const tDateTime = useTranslations('dateTime');

  const router = useRouter();
  const { refetch } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile.profilePictureUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: formatPhoneForInput(profile.phoneNumber),
      profilePictureUrl: profile.profilePictureUrl || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Format phone number with country code
      const formattedPhoneNumber = data.phoneNumber.startsWith('+994') ? data.phoneNumber : `+994${data.phoneNumber.replace(/\s/g, '')}`;

      const updateData: UpdateUserProfileCommand = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: formattedPhoneNumber,
        profilePictureUrl: data.profilePictureUrl || undefined,
      };

      const result = await updateProfileAction(updateData);

      if (result.success) {
        setSubmitStatus('success');
        // Use the response data if available, otherwise keep the submitted data
        const updatedProfile = result.data;
        reset({
          firstName: updatedProfile?.firstName || data.firstName,
          lastName: updatedProfile?.lastName || data.lastName,
          phoneNumber: formatPhoneForInput(updatedProfile?.phoneNumber || formattedPhoneNumber),
          profilePictureUrl: updatedProfile?.profilePictureUrl || data.profilePictureUrl || '',
        });

        // Refresh the page data
        router.refresh();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || t('messages.error.updateFailed'));
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(t('messages.error.generalError'));
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(t('messages.error.invalidFileType'));
      return;
    }

    setIsUploadingPicture(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadProfilePictureAction(formData);

      if (result.success && result.data?.url) {
        setProfilePictureUrl(result.data.url);
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 3000);
        // Refresh auth context to update header avatar
        await refetch();
      } else {
        setErrorMessage(!result.success && result.error ? result.error : t('messages.error.uploadFailed'));
      }
    } catch (error) {
      setErrorMessage(t('messages.error.generalError'));
      console.error('Profile picture upload error:', error);
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePicture = async () => {
    if (!profilePictureUrl) return;

    setIsUploadingPicture(true);
    setErrorMessage('');

    try {
      const result = await deleteProfilePictureAction();

      if (result.success) {
        setProfilePictureUrl('');
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 3000);
        // Refresh auth context to update header avatar
        await refetch();
      } else {
        setErrorMessage(result.error || t('messages.error.deleteFailed'));
      }
    } catch (error) {
      setErrorMessage(t('messages.error.generalError'));
      console.error('Profile picture delete error:', error);
    } finally {
      setIsUploadingPicture(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <PageHeader title={t('pageTitle')} subtitle={t('pageSubtitle')} maxWidth='lg' />

      {/* Main Content */}
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        <div className='space-y-6 sm:space-y-8'>
          {/* Status Messages */}
          {submitStatus === 'success' && <StatusMessage variant='success' title={t('messages.success.title')} message={t('messages.success.message')} />}

          {submitStatus === 'error' && <StatusMessage variant='error' title={t('messages.error.title')} message={errorMessage} />}

          {/* Profile Picture Section */}
          <div className='space-y-4 sm:space-y-6'>
            <Heading variant='card' as='h2'>
              {t('profilePicture.title')}
            </Heading>
            <div className='p-4 sm:p-6 rounded-xl border-2 border-gray-200'>
              <div className='flex items-center gap-4 sm:gap-6'>
                <div className='relative flex-shrink-0'>
                  <button
                    type='button'
                    onClick={handlePictureClick}
                    disabled={isUploadingPicture}
                    className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed'
                  >
                    {isUploadingPicture ? (
                      <IconLoader2 size={32} className='sm:w-9 sm:h-9 text-gray-400 animate-spin' />
                    ) : profilePictureUrl ? (
                      <img src={profilePictureUrl} alt={profile.firstName} className='w-full h-full object-cover' />
                    ) : (
                      <IconUser size={32} className='sm:w-9 sm:h-9 text-gray-400' />
                    )}
                  </button>
                  <input ref={fileInputRef} type='file' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handlePictureUpload} className='hidden' />
                  <IconButton
                    icon={
                      isUploadingPicture ? (
                        <IconLoader2 size={14} className='sm:w-4 sm:h-4 text-white animate-spin' />
                      ) : (
                        <IconCamera size={14} className='sm:w-4 sm:h-4 text-white' />
                      )
                    }
                    variant='primary'
                    size='md'
                    position='bottom-right-tight'
                    ariaLabel={t('profilePicture.uploadLabel')}
                    onClick={handlePictureClick}
                    disabled={isUploadingPicture}
                  />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm sm:text-base text-gray-900 mb-1'>{t('profilePicture.uploadButton')}</h3>
                  <p className='text-xs sm:text-sm text-gray-600'>{t('profilePicture.formatInfo')}</p>
                  {profilePictureUrl && (
                    <button
                      type='button'
                      onClick={handleDeletePicture}
                      disabled={isUploadingPicture}
                      className='mt-2 text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50'
                    >
                      <IconTrash size={14} />
                      {t('profilePicture.deleteButton')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 sm:space-y-8'>
            {/* Personal Information Form */}
            <div className='space-y-4 sm:space-y-6'>
              <Heading variant='card' as='h2'>
                {t('personalInfo.title')}
              </Heading>

              <div className='space-y-4 sm:space-y-6'>
                {/* Email (Read-only) */}
                <ReadOnlyInput
                  label={t('personalInfo.email.label')}
                  value={profile.email}
                  leftIcon={<IconMail size={18} />}
                  helperText={t('personalInfo.email.helperText')}
                />

                {/* First Name */}
                <TextInput
                  label={t('personalInfo.firstName.label')}
                  placeholder={t('personalInfo.firstName.placeholder')}
                  error={errors.firstName?.message}
                  leftIcon={<IconUser size={18} />}
                  {...register('firstName', {
                    required: t('personalInfo.firstName.required'),
                    minLength: {
                      value: 2,
                      message: t('personalInfo.firstName.minLength'),
                    },
                    maxLength: {
                      value: 50,
                      message: t('personalInfo.firstName.maxLength'),
                    },
                  })}
                />

                {/* Last Name */}
                <TextInput
                  label={t('personalInfo.lastName.label')}
                  placeholder={t('personalInfo.lastName.placeholder')}
                  error={errors.lastName?.message}
                  leftIcon={<IconUser size={18} />}
                  {...register('lastName', {
                    required: t('personalInfo.lastName.required'),
                    minLength: {
                      value: 2,
                      message: t('personalInfo.lastName.minLength'),
                    },
                    maxLength: {
                      value: 50,
                      message: t('personalInfo.lastName.maxLength'),
                    },
                  })}
                />

                {/* Phone Number */}
                <PhoneInput
                  label={t('personalInfo.phoneNumber.label')}
                  placeholder={t('personalInfo.phoneNumber.placeholder')}
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber', {
                    required: t('personalInfo.phoneNumber.required'),
                    pattern: {
                      value: /^[0-9\s]{9,15}$/,
                      message: t('personalInfo.phoneNumber.invalid'),
                    },
                  })}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className='space-y-4 sm:space-y-6'>
              <Heading variant='card' as='h2'>
                {t('accountInfo.title')}
              </Heading>
              <div className='p-4 sm:p-6 rounded-xl border-2 border-gray-200 space-y-3 sm:space-y-4'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-sm sm:text-base text-gray-600'>{t('accountInfo.registrationDate')}</span>
                  <span className='font-semibold text-sm sm:text-base text-gray-900'>{formatDate(profile.createdAt, tDateTime)}</span>
                </div>
                {profile.lastLoginAt && (
                  <div className='flex items-center justify-between gap-4'>
                    <span className='text-sm sm:text-base text-gray-600'>{t('accountInfo.lastLogin')}</span>
                    <span className='font-semibold text-sm sm:text-base text-gray-900'>{formatDate(profile.lastLoginAt, tDateTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4'>
              <Button
                type='submit'
                disabled={isSubmitting || !isDirty}
                variant={isDirty && !isSubmitting ? 'solid' : 'ghost'}
                fullWidth
                leftSection={<IconDeviceFloppy size={18} className='sm:w-5 sm:h-5' />}
              >
                {isSubmitting ? t('actions.saving') : t('actions.save')}
              </Button>

              {isDirty && (
                <Button
                  type='button'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  variant='secondary'
                  leftSection={<IconX size={18} className='sm:w-5 sm:h-5' />}
                  className='whitespace-nowrap'
                >
                  {t('actions.cancel')}
                </Button>
              )}
            </div>
          </form>

          {/* Info Panel */}
          <InfoBanner variant='default' title={t('infoBanner.title')} description={t('infoBanner.description')} size='md' />
        </div>
      </div>
    </div>
  );
}
