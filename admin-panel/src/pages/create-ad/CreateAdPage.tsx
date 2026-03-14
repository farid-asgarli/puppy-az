import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Typography, message, Row, Col, Space, Radio } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, DeleteOutlined, LeftOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/features/categories';
import { useCities } from '@/features/cities';
import { useRegularUsers } from '@/features/users';
import { useDistrictsByCity } from '@/features/districts';

import { ListingType, Gender, AnimalSize } from '@/shared/api/types';

import { api } from '@/shared/api/httpClient';
import { useQuery } from '@tanstack/react-query';

const { Title } = Typography;
const { TextArea } = Input;

interface CreateAdFormValues {
  userId: string;
  title: string;
  description: string;
  adType: ListingType;
  petBreedId?: number;
  petCategoryId?: number;
  cityId: number;
  districtId: number;
  ageYears?: number;
  ageMonths?: number;
  gender?: Gender;
  color?: string;
  weight?: number;
  size?: AnimalSize;
  price: number;
}

export default function CreateAdPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateAdFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string }[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [selectedAdType, setSelectedAdType] = useState<ListingType | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [isNewUser, setIsNewUser] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [newUserPhone, setNewUserPhone] = useState('+994 ');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // Queries
  const { data: usersResponse } = useRegularUsers({
    page: 1,
    pageSize: 1000,
  });
  const { data: categories } = useCategories();
  const { data: breeds } = useQuery({
    queryKey: ['public-breeds', selectedCategoryId],
    queryFn: async () => {
      const params = selectedCategoryId ? `?categoryId=${selectedCategoryId}` : '';
      return api.get<{ id: number; title: string; categoryId: number }[]>(`/pet-ads/breeds${params}`);
    },
    enabled: !!selectedCategoryId,
  });
  const { data: citiesResponse } = useCities({
    page: 1,
    pageSize: 500,
  });
  const { data: districts } = useDistrictsByCity(selectedCityId);
  const { data: colors } = useQuery({
    queryKey: ['public-colors-az'],
    queryFn: async () => {
      return api.get<
        {
          id: number;
          key: string;
          title: string;
          backgroundColor: string;
          textColor: string;
          borderColor: string;
        }[]
      >('/pet-ads/colors', { headers: { 'Accept-Language': 'az' } });
    },
  });
  const { data: adTypes } = useQuery({
    queryKey: ['public-ad-types'],
    queryFn: async () => {
      return api.get<
        {
          id: number;
          key: string;
          title: string;
          description: string;
          emoji: string;
        }[]
      >('/pet-ads/types');
    },
  });

  const users = usersResponse?.items || [];
  const cities = citiesResponse?.items || [];

  // Ad Type options from API
  const adTypeOptions = (adTypes || []).map((type) => ({
    value: type.id,
    label: `${type.emoji} ${type.title}`,
  }));

  // Gender options
  const genderOptions = [
    { value: Gender.Male, label: t('listings.gender.male') },
    { value: Gender.Female, label: t('listings.gender.female') },
  ];

  // Size options
  const sizeOptions = [
    {
      value: AnimalSize.ExtraSmall,
      label: t('listings.size.extraSmall'),
    },
    { value: AnimalSize.Small, label: t('listings.size.small') },
    { value: AnimalSize.Medium, label: t('listings.size.medium') },
    { value: AnimalSize.Large, label: t('listings.size.large') },
    {
      value: AnimalSize.ExtraLarge,
      label: t('listings.size.extraLarge'),
    },
  ];

  // Image upload handler - supports multiple files
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      message.warning(t('createAd.maxImages', { count: 10 }));
      return;
    }

    setUploadingCount(filesToUpload.length);

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append('file', file);

      const currentUserId = form.getFieldValue('userId');
      if (currentUserId) {
        formData.append('userId', currentUserId);
      }

      try {
        const response = await api.post<Array<{ id: number; url: string }>>('/admin/pet-ads/images/upload', formData);

        const img = response[0];
        if (img) {
          setUploadedImages((prev) => [...prev, { id: img.id, url: img.url }]);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        message.error(t('createAd.imageUploadError'));
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Move image left/right for reordering
  const moveImage = (fromIndex: number, toIndex: number) => {
    const updated = [...uploadedImages];
    const [removed] = updated.splice(fromIndex, 1);
    if (removed) {
      updated.splice(toIndex, 0, removed);
    }
    setUploadedImages(updated);
  };

  // Delete an uploaded image
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleCreateUser = async () => {
    if (!newUserPhone.trim()) {
      message.error(t('createAd.phoneRequired'));
      return;
    }

    setCreatingUser(true);
    try {
      // Remove spaces from phone number before sending
      const phoneNumberWithoutSpaces = newUserPhone.replace(/\s/g, '');

      const response = await api.post<{ id: string }>('/admin/regular-users', {
        phoneNumber: phoneNumberWithoutSpaces,
        firstName: newUserFirstName || undefined,
        lastName: newUserLastName || undefined,
      });

      message.success(t('createAd.userCreatedSuccess'));
      form.setFieldValue('userId', response.id);
      setIsNewUser(false);
      setNewUserPhone('+994 ');
      setNewUserFirstName('');
      setNewUserLastName('');
    } catch (error: any) {
      console.error('User creation failed:', error);
      const errorMessage = error.response?.data?.message || t('createAd.userCreationError');
      message.error(errorMessage);
    } finally {
      setCreatingUser(false);
    }
  };
  const handleSubmit = async (values: CreateAdFormValues) => {
    if (uploadedImages.length === 0) {
      message.warning(t('createAd.atLeastOneImage'));
      return;
    }

    // If new user mode is active but user not created yet
    if (isNewUser && !values.userId) {
      message.error(t('createAd.createUserFirst'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: values.userId,
        title: values.title,
        description: values.description,
        adType: values.adType,
        petBreedId: values.petBreedId,
        petCategoryId: values.petCategoryId,
        cityId: values.cityId,
        districtId: values.districtId || undefined,
        ageInMonths: (values.ageYears || 0) * 12 + (values.ageMonths || 0) || undefined,
        gender: values.gender,
        color: values.color,
        weight: values.weight,
        size: values.size,
        price: values.price,
        imageIds: uploadedImages.map((img) => img.id),
      };

      const response = await api.post<{ id: number }>('/admin/pet-ads', payload);
      message.success(t('createAd.success'));
      navigate(`/listings/${response.id}`);
    } catch (error: any) {
      console.error('Ad creation failed:', error);
      const errorMessage = error.response?.data?.message || t('createAd.error');
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle category change from breed selection
  useEffect(() => {
    const selectedBreed = breeds?.find((b: any) => b.id === form.getFieldValue('petBreedId'));
    if (selectedBreed && selectedBreed.categoryId) {
      form.setFieldValue('petCategoryId', selectedBreed.categoryId);
      setSelectedCategoryId(selectedBreed.categoryId);
    }
  }, [form.getFieldValue('petBreedId'), breeds, form]);

  // Determine if breed is required based on ad type
  const isBreedRequired = selectedAdType === ListingType.Sale || selectedAdType === ListingType.Match || selectedAdType === ListingType.Lost;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>{t('createAd.title')}</Title>
        <p className="text-gray-600 dark:text-gray-400">{t('createAd.description')}</p>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 0,
          }}
        >
          <Row gutter={[16, 16]}>
            {/* User Selection Mode */}
            <Col xs={24}>
              <Radio.Group
                value={isNewUser}
                onChange={(e) => {
                  setIsNewUser(e.target.value);
                  if (e.target.value) {
                    form.setFieldValue('userId', undefined);
                  }
                }}
              >
                <Radio value={false}>{t('createAd.existingUser')}</Radio>
                <Radio value={true}>{t('createAd.newUser')}</Radio>
              </Radio.Group>
            </Col>

            {/* Existing User Selection */}
            {!isNewUser && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="userId"
                  label={t('createAd.user')}
                  rules={[
                    {
                      required: !isNewUser,
                      message: t('createAd.userRequired'),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={t('createAd.selectUser')}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={users.map((user) => ({
                      value: user.id,
                      label: `${user.firstName || ''} ${user.lastName || ''} (${user.email || user.phoneNumber || user.id})`,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}

            {/* New User Form */}
            {isNewUser && (
              <>
                <Col xs={24} md={8}>
                  <Form.Item label={t('createAd.newUserPhone')} required>
                    <Input
                      placeholder="+994 55 338 81 06"
                      value={newUserPhone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Remove all non-digit characters except +
                        const digitsOnly = value.replace(/[^\d+]/g, '');

                        // Ensure it starts with +994
                        if (!digitsOnly.startsWith('+994')) {
                          setNewUserPhone('+994 ');
                          return;
                        }

                        // Get only the digits after +994
                        const phoneDigits = digitsOnly.substring(4);

                        // Limit to 9 digits
                        if (phoneDigits.length > 9) {
                          return;
                        }

                        // Format: +994 XX XXX XX XX
                        let formatted = '+994';
                        if (phoneDigits.length > 0) {
                          formatted += ' ' + phoneDigits.substring(0, 2);
                        }
                        if (phoneDigits.length > 2) {
                          formatted += ' ' + phoneDigits.substring(2, 5);
                        }
                        if (phoneDigits.length > 5) {
                          formatted += ' ' + phoneDigits.substring(5, 7);
                        }
                        if (phoneDigits.length > 7) {
                          formatted += ' ' + phoneDigits.substring(7, 9);
                        }

                        setNewUserPhone(formatted);
                      }}
                      maxLength={17}
                      disabled={creatingUser}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('createAd.newUserFirstName')}>
                    <Input
                      placeholder={t('createAd.firstNamePlaceholder')}
                      value={newUserFirstName}
                      onChange={(e) => setNewUserFirstName(e.target.value)}
                      disabled={creatingUser}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('createAd.newUserLastName')}>
                    <Input
                      placeholder={t('createAd.lastNamePlaceholder')}
                      value={newUserLastName}
                      onChange={(e) => setNewUserLastName(e.target.value)}
                      disabled={creatingUser}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item label=" ">
                    <Button type="primary" icon={<UserAddOutlined />} onClick={handleCreateUser} loading={creatingUser} block>
                      {t('createAd.createUser')}
                    </Button>
                  </Form.Item>
                </Col>
              </>
            )}

            {/* Ad Type */}
            <Col xs={24} md={isNewUser ? 24 : 12}>
              <Form.Item name="adType" label={t('createAd.adType')} rules={[{ required: true, message: t('createAd.adTypeRequired') }]}>
                <Select placeholder={t('createAd.selectAdType')} options={adTypeOptions} onChange={(value) => setSelectedAdType(value)} />
              </Form.Item>
            </Col>

            {/* Title */}
            <Col xs={24}>
              <Form.Item
                name="title"
                label={t('createAd.titleLabel')}
                rules={[
                  { required: true, message: t('createAd.titleRequired') },
                  { max: 200, message: t('createAd.titleMaxLength') },
                ]}
              >
                <Input placeholder={t('createAd.titlePlaceholder')} maxLength={200} showCount />
              </Form.Item>
            </Col>

            {/* Description */}
            <Col xs={24}>
              <Form.Item
                name="description"
                label={t('createAd.descriptionLabel')}
                rules={[
                  {
                    required: true,
                    message: t('createAd.descriptionRequired'),
                  },
                  { max: 2000, message: t('createAd.descriptionMaxLength') },
                ]}
              >
                <TextArea rows={4} placeholder={t('createAd.descriptionPlaceholder')} maxLength={2000} showCount />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col xs={24} md={12}>
              <Form.Item name="petCategoryId" label={t('createAd.category')}>
                <Select
                  placeholder={t('createAd.selectCategory')}
                  allowClear
                  options={categories?.map((cat: any) => ({
                    value: cat.id,
                    label: cat.title,
                  }))}
                  onChange={(value) => {
                    setSelectedCategoryId(value);
                    form.setFieldValue('petBreedId', undefined);
                  }}
                />
              </Form.Item>
            </Col>

            {/* Breed */}
            <Col xs={24} md={12}>
              <Form.Item
                name="petBreedId"
                label={t('createAd.breed')}
                rules={[
                  {
                    required: isBreedRequired,
                    message: t('createAd.breedRequired'),
                  },
                ]}
              >
                <Select
                  placeholder={t('createAd.selectBreed')}
                  allowClear
                  disabled={!selectedCategoryId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const label = option?.label;
                    if (typeof label === 'string') {
                      return label.toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                  options={breeds?.map((breed: any) => ({
                    value: breed.id,
                    label: breed.title,
                  }))}
                />
              </Form.Item>
            </Col>

            {/* City */}
            <Col xs={24} md={12}>
              <Form.Item name="cityId" label={t('createAd.city')} rules={[{ required: true, message: t('createAd.cityRequired') }]}>
                <Select
                  showSearch
                  placeholder={t('createAd.selectCity')}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={cities.map((city) => ({
                    value: city.id,
                    label: city.nameAz || city.nameEn || city.nameRu,
                  }))}
                  onChange={(value) => {
                    setSelectedCityId(value);
                    form.setFieldValue('districtId', undefined);
                  }}
                />
              </Form.Item>
            </Col>

            {/* District */}
            <Col xs={24} md={12}>
              <Form.Item
                name="districtId"
                label={t('createAd.district')}
                rules={[
                  {
                    required: true,
                    message: t('createAd.districtRequired'),
                  },
                ]}
              >
                <Select
                  placeholder={t('createAd.selectDistrict')}
                  allowClear
                  disabled={!selectedCityId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const label = option?.label;
                    if (typeof label === 'string') {
                      return label.toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                  options={districts?.map((d: any) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                />
              </Form.Item>
            </Col>

            {/* Age - Year & Month */}
            <Col xs={24} md={12}>
              <Form.Item label={t('createAd.age', 'Yaş')}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="ageYears" noStyle>
                      <InputNumber
                        min={0}
                        max={30}
                        placeholder="0"
                        style={{ width: '100%' }}
                        addonAfter={t('createAd.year', 'İl')}
                        controls={false}
                        keyboard={true}
                        parser={(value) => {
                          const parsed = value?.replace(/[^0-9]/g, '') || '';
                          return parsed ? Number(parsed) : ('' as any);
                        }}
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="ageMonths" noStyle>
                      <InputNumber
                        min={0}
                        max={11}
                        placeholder="0"
                        style={{ width: '100%' }}
                        addonAfter={t('createAd.month', 'Ay')}
                        controls={false}
                        keyboard={true}
                        parser={(value) => {
                          const parsed = value?.replace(/[^0-9]/g, '') || '';
                          return parsed ? Number(parsed) : ('' as any);
                        }}
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            {/* Gender */}
            <Col xs={24} md={12}>
              <Form.Item name="gender" label={t('createAd.gender')}>
                <Select placeholder={t('createAd.selectGender')} allowClear options={genderOptions} />
              </Form.Item>
            </Col>

            {/* Color */}
            <Col xs={24} md={12}>
              <Form.Item name="color" label={t('createAd.color')}>
                <Select
                  placeholder={t('createAd.selectColor')}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const label = option?.label;
                    if (typeof label === 'string') {
                      return label.toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                  options={colors?.map((color: any) => ({
                    value: color.title,
                    label: color.title,
                  }))}
                />
              </Form.Item>
            </Col>

            {/* Weight */}
            <Col xs={24} md={12}>
              <Form.Item name="weight" label={t('createAd.weight')}>
                <InputNumber
                  min={0}
                  max={500}
                  placeholder={t('createAd.weightPlaceholder')}
                  style={{ width: '100%' }}
                  precision={2}
                  addonAfter="kg"
                  controls={false}
                  parser={(value) => {
                    const parsed = value?.replace(/[^0-9.]/g, '') || '';
                    return parsed ? Number(parsed) : ('' as any);
                  }}
                  onKeyDown={(e) => {
                    const currentValue = (e.target as HTMLInputElement).value;
                    if (e.key === '.' && currentValue.includes('.')) {
                      e.preventDefault();
                      return;
                    }
                    if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            {/* Size */}
            <Col xs={24} md={12}>
              <Form.Item name="size" label={t('createAd.size')}>
                <Select placeholder={t('createAd.selectSize')} allowClear options={sizeOptions} />
              </Form.Item>
            </Col>

            {/* Price */}
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label={t('createAd.price')}
                rules={[
                  { required: true, message: t('createAd.priceRequired') },
                  {
                    type: 'number',
                    min: 0,
                    message: t('createAd.priceMinimum'),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder={t('createAd.pricePlaceholder')}
                  style={{ width: '100%' }}
                  precision={2}
                  addonAfter="AZN"
                  controls={false}
                  parser={(value) => {
                    const parsed = value?.replace(/[^0-9.]/g, '') || '';
                    return parsed ? Number(parsed) : ('' as any);
                  }}
                  onKeyDown={(e) => {
                    const currentValue = (e.target as HTMLInputElement).value;
                    if (e.key === '.' && currentValue.includes('.')) {
                      e.preventDefault();
                      return;
                    }
                    if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            {/* Images */}
            <Col xs={24}>
              <Form.Item label={t('createAd.images')} required>
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={img.id} className="relative group w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url.startsWith('http') ? img.url : img.url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />

                      {/* Main image badge */}
                      {index === 0 && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded z-10 flex items-center gap-1">
                          <StarFilled style={{ fontSize: 10 }} />
                          Əsas
                        </div>
                      )}

                      {/* Hover overlay with controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {/* Move left */}
                        {index > 0 && (
                          <Button
                            type="primary"
                            size="small"
                            icon={<LeftOutlined />}
                            onClick={() => moveImage(index, index - 1)}
                            className="!bg-white/90 !text-black !border-0 hover:!bg-white"
                          />
                        )}

                        {/* Delete */}
                        <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => removeImage(index)} />

                        {/* Move right */}
                        {index < uploadedImages.length - 1 && (
                          <Button
                            type="primary"
                            size="small"
                            icon={<RightOutlined />}
                            onClick={() => moveImage(index, index + 1)}
                            className="!bg-white/90 !text-black !border-0 hover:!bg-white"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Upload loading placeholders */}
                  {Array.from({ length: uploadingCount }).map((_, i) => (
                    <div
                      key={`uploading-${i}`}
                      className="w-[120px] h-[120px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                    >
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
                    </div>
                  ))}

                  {/* Add button */}
                  {uploadedImages.length + uploadingCount < 10 && (
                    <label className="w-[120px] h-[120px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                      <span className="text-xs text-gray-500 mt-1">{t('createAd.uploadImage')}</span>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  {uploadedImages.length}/10 · İlk şəkil əsas şəkil olaraq istifadə olunur. Sıranı dəyişmək üçün şəkilin üzərinə gəlin.
                </div>
              </Form.Item>
            </Col>

            {/* Submit Button */}
            <Col xs={24}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large">
                  {t('createAd.submit')}
                </Button>
                <Button size="large" onClick={() => navigate('/listings')}>
                  {t('common.cancel')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
