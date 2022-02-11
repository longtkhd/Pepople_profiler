/**
 *
 * CompanyInfoForm
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Form, Button, Row, Col, Select, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { Upload, Tooltip} from 'antd';

import ImgCrop from 'antd-img-crop';
import InputColor from 'react-input-color';

import HighlightText from 'components/atoms/HighlightText';

import { LoadingOutlined, QuestionCircleOutlined  } from '@ant-design/icons';
import UploadImage from 'images/icons/group-2.png';
import LabelIcon from 'images/icons/group-3.svg';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { getBase64, imageEncode } from 'utils/companyImageHelper';


const { Option } = Select;

function CompanyInfoForm(props) {
  const { onSubmit, editMode, agencyInfo, logo, background } = props;
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingBackground, setLoadingBackground] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState(null);
  const [fontColor, setFontColor] = useState('#ff00ff');
  const [linksColor, setLinksColor] = useState('#ff00ff');
  const [buttonsColor, setButtonsColor] = useState('#ff00ff');

  const uploadCompanyLogoRef = useRef(null);
  const uploadBackgroundRef = useRef(null);

  const agencySizeOptions = [
    { value: 0, displayValue: 'Less than 5 recruiters' },
    { value: 1, displayValue: '6 to 15 recruiters' },
    { value: 2, displayValue: '16 to 30 recruiters' },
    { value: 3, displayValue: 'More than 30 recruiters' },
  ];

  const industryOptions = [
    { value: 'industry1', displayValue: 'Industry 1' },
    { value: 'industry2', displayValue: 'Industry 2' },
  ];

  const countryOptions = [
    { value: 'australia', displayValue: 'Australia' },
    { value: 'vietnam', displayValue: 'Viet Nam' },
  ];

  const uploadLogoButton = (
    <div className="upload-logo-layout">
      {loadingLogo ? (
        <LoadingOutlined />
      ) : (
        <div className="icon-area">
          <img src={UploadImage} />
        </div>
      )}
      <div className="text-area bold-text">
        <FormattedMessage {...globalMessages.upload} />
      </div>
    </div>
  );

  const uploadBackgroundButton = (
    <div className="upload-background-layout">
      {loadingBackground ? (
        <LoadingOutlined />
      ) : (
        <>
          <img src={UploadImage} className="icon-area" />
          <div className="text-area bold-text">
            <FormattedMessage {...globalMessages.upload} />
          </div>
        </>
      )}
    </div>
  );

  const InputColorItem = ({ title, color, onChangeColor }) => {
    const onChange = value => {
      onChangeColor(value.hex);
    };

    return (
      <div className="input-color-item">
        <span className="input-color-title">{title}</span>
        <span className="input-color">
          <InputColor initialValue={color} onChange={onChange} />
        </span>
      </div>
    );
  };

  const updateFontColor = color => {
    setFontColor(color);
  };

  const updateLinksColor = color => {
    setLinksColor(color);
  };

  const updateButtonsColor = color => {
    setButtonsColor(color);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const onFinish = value => {
    const { agency_size, industry, agency_country, agency_name } = value;

    const data = {
      logo: companyLogo,
      background: backgroundImage,
      agencyInfo: {
        company_info: {
          industry,
          agency_size,
          font_color: fontColor,
          link_color: linksColor,
          button_color: buttonsColor,
        }
      },
    }
    if (editMode) {
      data.agencyInfo.agency_name = agency_name;
      data.agencyInfo.country_code = agency_country;
    }
    onSubmit(data);
  };

  const handleChangeImage = (info, type) => {
    if (info.file.status === 'uploading') {
      if (type == 'logo') {
        setLoadingLogo(true);
      } else if (type == 'background') {
        setLoadingBackground(true);
      }
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        if (type == 'logo') {
          setLoadingLogo(false);
          setCompanyLogo(info.file.originFileObj);
          setPreviewCompanyLogo(imageUrl);
        } else if (type == 'background') {
          setLoadingBackground(false);
          setBackgroundImage(info.file.originFileObj);
          setPreviewBackgroundImage(imageUrl);
        }
      });
    }
  };

  const handleDeleteBackground = () => {
    setBackgroundImage(null);
    setPreviewBackgroundImage(null);
  };

  const handleReplaceLogo = () => {
    uploadCompanyLogoRef.current.click();
  };

  const handleReplaceBackground = () => {
    uploadBackgroundRef.current.click();
  };

  useEffect(() => {
    if (agencyInfo) {
      setFontColor(agencyInfo.font_color);
      setLinksColor(agencyInfo.link_color);
      setButtonsColor(agencyInfo.button_color);
    }
  }, [agencyInfo]);

  useEffect(() => {
    if (logo && agencyInfo.logo) {
      const logoPreview = imageEncode(logo);
      const file = new File([logo], agencyInfo.logo, { type: MimeType});
      if(file) setCompanyLogo(file);
      setPreviewCompanyLogo(logoPreview);
    }
  }, [logo, agencyInfo]);

  useEffect(() => {
    if (background && agencyInfo.background_image) {
      const backgroundPreview = imageEncode(background);
      const file = new File([background], agencyInfo.background_image, { type: MimeType});
      if(file) setBackgroundImage(file);
      setPreviewBackgroundImage(backgroundPreview);
    }
  }, [background, agencyInfo]);

  return (
    <Form
      name="basic"
      layout="vertical"
      className="company-info-form"
      onFinish={onFinish}
    >
      {!editMode ? (
        <div>
          <Row flex="flex" gutter={[32, 0]}>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <div className="label-with-tooltip">
                    <FormattedMessage {...messages.companyLogo} />
                    <Tooltip placement="topLeft" title={<FormattedMessage {...messages.imageUploadDescription} />}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                }
                className="logo-upload"
                name="companyLogo"
              >
                <ImgCrop rotate>
                  <Upload
                    accept="image/*"
                    listType="picture-card"
                    customRequest={dummyRequest}
                    multiple={false}
                    showUploadList={false}
                    onChange={info => handleChangeImage(info, 'logo')}
                  >
                    {previewCompanyLogo ? (
                      <img
                        src={previewCompanyLogo}
                        alt="company-logo"
                        style={{ width: '100%' }}
                      />
                    ) : (
                      uploadLogoButton
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Row>
                <Col md={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label={<FormattedMessage {...messages.industry} />}
                    name="industry"
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.industryRequired} />
                        ),
                      },
                    ]}
                  >
                    <Select placeholder="Industry">
                      {industryOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.displayValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label={<FormattedMessage {...messages.agencySize} />}
                    name="agency_size"
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.agencySizeRequired} />
                        ),
                      },
                    ]}
                  >
                    <Select placeholder="Select tier">
                      {agencySizeOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.displayValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={10}>
              <Row>
                <Col md={8}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    className="background-image-upload"
                    label={
                      <div className="label-with-tooltip">
                        <FormattedMessage {...messages.backgroundImage} />
                        <Tooltip placement="topLeft" title={<FormattedMessage {...messages.imageUploadDescription} />}>
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    }
                    name="backgroundImage"
                  >
                    <ImgCrop rotate aspect={3}>
                      <Upload
                        accept="image/*"
                        listType="picture-card"
                        customRequest={dummyRequest}
                        multiple={false}
                        showUploadList={false}
                        onChange={info => handleChangeImage(info, 'background')}
                      >
                        {previewBackgroundImage ? (
                          <img
                            src={previewBackgroundImage}
                            alt="background-image"
                            style={{ width: '100%' }}
                          />
                        ) : (
                          uploadBackgroundButton
                        )}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label={<FormattedMessage {...messages.selectColor} />}
                    name="colors"
                  >
                    <div className="input-color-container">
                      <InputColorItem
                        title={<FormattedMessage {...messages.font} />}
                        color={fontColor}
                        onChangeColor={updateFontColor}
                      />
                      <InputColorItem
                        title={<FormattedMessage {...messages.links} />}
                        color={linksColor}
                        onChangeColor={updateLinksColor}
                      />
                      <InputColorItem
                        title={<FormattedMessage {...messages.buttons} />}
                        color={buttonsColor}
                        onChangeColor={updateButtonsColor}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="text-center helper">
            <span>
              <FormattedMessage {...messages.curiousToKnow} />
            </span>
            <span className="example">
              <HighlightText>
                <FormattedMessage {...messages.checkout} />
              </HighlightText>
            </span>
          </div>
        </div>
      ) : (
        <div className="update-agency-info">
          <Row flex="flex">
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <>
                    <FormattedMessage {...messages.companyLogo} />
                    <img src={LabelIcon} style={{marginLeft: '10px'}} />
                  </>
                }
                className="logo-upload"
                name="companyLogo"
              >
                <ImgCrop rotate>
                  <Upload
                    accept="image/*"
                    listType="picture-card"
                    customRequest={dummyRequest}
                    multiple={false}
                    showUploadList={false}
                    onChange={info => handleChangeImage(info, 'logo')}
                  >
                    {previewCompanyLogo ? (
                      <img
                        ref={uploadCompanyLogoRef}
                        src={previewCompanyLogo}
                        alt="company-logo"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      uploadLogoButton
                    )}
                  </Upload>
                </ImgCrop>
                {previewCompanyLogo && (
                  <div className="upload-button-group">
                    <Button type="primary" onClick={handleReplaceLogo}>
                      Replace
                    </Button>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                labelCol={{ span: 24 }}
                className="logo-upload"
                label={
                  <>
                    <FormattedMessage {...messages.backgroundImage}/>
                    <img src={LabelIcon} style={{marginLeft: '10px'}} />
                  </>
                }
                name="backgroundImage"
              >
                <ImgCrop rotate aspect={3}>
                  <Upload
                    accept="image/*"
                    listType="picture-card"
                    customRequest={dummyRequest}
                    multiple={false}
                    showUploadList={false}
                    onChange={info => handleChangeImage(info, 'background')}
                  >
                    {previewBackgroundImage ? (
                      <img
                        src={previewBackgroundImage}
                        ref={uploadBackgroundRef}
                        alt="background-image"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      uploadLogoButton
                    )}
                  </Upload>
                </ImgCrop>
                {previewBackgroundImage && (
                  <div className="upload-button-group">
                    <Button
                      danger
                      style={{
                        marginRight: '10px',
                        backgroundImage: 'unset',
                        backgroundColor: '#f54e60',
                        color: '#ffffff',
                      }}
                      onClick={handleDeleteBackground}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> &nbsp; Delete
                    </Button>
                    <Button type="primary" onClick={handleReplaceBackground}>
                      Replace
                    </Button>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.selectColor} />}
                name="colors"
              >
                <div className="input-color-container">
                  <InputColorItem
                    title={<FormattedMessage {...messages.font} />}
                    color={fontColor}
                    onChangeColor={updateFontColor}
                  />
                  <InputColorItem
                    title={<FormattedMessage {...messages.links} />}
                    color={linksColor}
                    onChangeColor={updateLinksColor}
                  />
                  <InputColorItem
                    title={<FormattedMessage {...messages.buttons} />}
                    color={buttonsColor}
                    onChangeColor={updateButtonsColor}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row flex="flex" style={{ marginTop: '50px' }}>
            <Col md={12}>
              <Form.Item
                label={<FormattedMessage {...messages.agencyName} />}
                name="agency_name"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage {...messages.agencyNameRequired} />
                    ),
                  },
                ]}
                initialValue={agencyInfo?.agency_name}
              >
                <Input style={{ width: '90%' }} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.industry} />}
                name="industry"
                initialValue={agencyInfo?.industry}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage {...messages.industryRequired} />
                    ),
                  },
                ]}
              >
                <Select
                  placeholder="Select tier"
                  style={{ width: '90%' }}
                  defaultValue={agencyInfo?.industry}
                >
                  {industryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.displayValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row flex="flex">
            <Col md={12}>
              <Form.Item
                label={<FormattedMessage {...messages.agencyCountry} />}
                name="agency_country"
                initialValue={agencyInfo?.country_code}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage {...messages.agencyCountryRequired} />
                    ),
                  },
                ]}
              >
                <Select
                  placeholder="Select tier"
                  style={{ width: '90%' }}
                  defaultValue={agencyInfo?.country_code}
                >
                  {countryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.displayValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={<FormattedMessage {...messages.agencySize} />}
                name="agency_size"
                initialValue={parseInt(agencyInfo?.agency_size)}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage {...messages.agencySizeRequired} />
                    ),
                  },
                ]}
              >
                <Select
                  placeholder="Select tier"
                  style={{ width: '90%' }}
                  defaultValue={parseInt(agencyInfo?.agency_size)}
                >
                  {agencySizeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.displayValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}

      <Form.Item
        className="submit-layout text-center"
        style={{ marginTop: '60px' }}
      >
        <Button type="primary" htmlType="submit">
          {editMode ? 'Update' : <FormattedMessage {...globalMessages.next} />}
        </Button>
      </Form.Item>
    </Form>
  );
}

CompanyInfoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  agencyInfo: PropTypes.object,
  logo: PropTypes.object,
  background: PropTypes.object,
};

export default memo(CompanyInfoForm);
