/**
 *
 * CompanyInfoForm
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import getCountryAction from 'containers/common_provider/get_country/actions';
import getIndustryAction from 'containers/common_provider/get_industry/actions';
import { makeSelectGetCountryLoading, makeSelectGetCountryResponse } from 'containers/common_provider/get_country/selectors';
import { makeSelectGetIndustryLoading, makeSelectGetIndustryResponse } from 'containers/common_provider/get_industry/selectors';

import { Button, Col, Form, Input, Row, Select, Tooltip, Upload } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import ImgCrop from 'antd-img-crop';
import InputColor from 'react-input-color';
import HighlightText from 'components/atoms/HighlightText';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import UploadImage from 'images/icons/group-2.png';
import LabelIcon from 'images/icons/group-3.svg';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { getBase64, imageEncode } from 'utils/companyImageHelper';
import { clearNumber } from 'utils/formatInputHelper';

const { Option } = Select;

function CompanyInfoForm(props) {
  const {
    onSubmit,
    editMode,
    agencyInfo,
    logo,
    getCountry,
    countryLoading,
    countryResponse,
    getIndustry,
    industryLoading,
    industryResponse,
  } = props;
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [initialFont, setInitialFont] = useState(agencyInfo?.font_color || '#333333');

  const [fontColor, setFontColor] = useState({});


  const uploadCompanyLogoRef = useRef(null);
  const [form] = Form.useForm();

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

  const updateFontColor = color => {
    setFontColor(color.hex)
  }
  
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleChaneAgencySize = e => {
    let size = clearNumber(e.currentTarget.value);
    form.setFieldsValue({ agency_size: size });
  };

  const onFinish = value => {
    const { agency_size, industry, agency_country, agency_name } = value;
    const data = {
      logo: companyLogo,
      agencyInfo: {
        company_info: {
          industry,
          agency_size,
          font_color: fontColor
        },
      },
    };
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
      }
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        if (type == 'logo') {
          setLoadingLogo(false);
          setCompanyLogo(info.file.originFileObj);
          setPreviewCompanyLogo(imageUrl);
        }
      });
    }
  };

  const handleReplaceLogo = () => {
    uploadCompanyLogoRef.current.click();
  };

  useEffect(() => {
    if (agencyInfo) {
      setInitialFont(agencyInfo.font_color);
    }
  }, [agencyInfo]);

  useEffect(() => {
    if (logo && agencyInfo.logo) {
      const logoPreview = imageEncode(logo);
      const file = new File([logo], agencyInfo.logo, { type: MimeType });
      if (file) setCompanyLogo(file);
      setPreviewCompanyLogo(logoPreview);
    }
  }, [logo, agencyInfo]);

  useEffect(() => {
    if (countryResponse) {
      setCountries(countryResponse);
    }
    return () => { };
  }, [countryResponse]);

  useEffect(() => {
    if (industryResponse) {
      setIndustries(industryResponse);
    }
  }, [industryResponse]);

  useEffect(() => {
    getIndustry();
    getCountry();
  }, []);

  return (
    <Form
      name="basic"
      layout="vertical"
      className="company-info-form"
      form={form}
      onFinish={onFinish}
    >
      <div className="update-agency-info">
        <Row flex="flex" className={'company-info'}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label={
                <div  style={{ "margin": "auto" }}>
                  <FormattedMessage {...messages.companyLogo} />
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedMessage
                        {...messages.logoDescription}
                      />
                    }
                  >
                    <img src={LabelIcon} style={{ marginLeft: '10px' }} />
                  </Tooltip>
                </div>
              }
              className="logo-upload"
              name="companyLogo"
            >
              <Upload
                accept="image/png"
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
              {previewCompanyLogo && (
                <div className="upload-button-group">
                  <Button type="primary" onClick={handleReplaceLogo}>
                    <FormattedMessage {...messages.replace} />
                  </Button>
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label={<FormattedMessage {...messages.selectColor} />}
              name="colors"
              className={'input-color'}
            >
              <div className="input-color-container">
                <div className="input-color-item">
                  <span className="input-color-item-message">
                    <FormattedMessage {...messages.font} />
                  </span>
                  <InputColor initialValue={initialFont} onChange={updateFontColor} />
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row flex="flex" style={{ marginTop: '50px' }} gutter={32}>
          <Col md={12} sm={24} xs={24}>
            <Form.Item
              label={<FormattedMessage {...messages.agencyName} />}
              name="agency_name"
              initialValue={agencyInfo?.agency_name}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage {...messages.agencyNameRequired} />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} sm={24} xs={24}>
            <Form.Item
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
                loading={industryLoading}
                showSearch
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {industries.map(option => (
                  <Option key={option.id} value={option.name}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row flex="flex" gutter={32}>
          <Col md={12} sm={24} xs={24}>
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
                loading={countryLoading}
                showSearch
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {countries.map(option => (
                  <Option key={option.id} value={option.code}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} sm={24} xs={24}>
            <Form.Item
              label={<FormattedMessage {...messages.agencySize} />}
              name="agency_size"
              initialValue={agencyInfo?.agency_size}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage {...messages.agencySizeRequired} />
                  ),
                },
              ]}
            >
              <Input onChange={handleChaneAgencySize} disabled={true}/>
            </Form.Item>
          </Col>
        </Row>
      </div>

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
  getCountry: PropTypes.func,
  countryLoading: PropTypes.bool,
  countryResponse: PropTypes.array,
  getIndustry: PropTypes.func,
  industryLoading: PropTypes.bool,
  industryResponse: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  countryLoading: makeSelectGetCountryLoading(),
  countryResponse: makeSelectGetCountryResponse(),
  industryLoading: makeSelectGetIndustryLoading(),
  industryResponse: makeSelectGetIndustryResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getCountry: () => dispatch(getCountryAction()),
    getIndustry: () => dispatch(getIndustryAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CompanyInfoForm);
