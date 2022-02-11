/**
 *
 * CompanyInfoFormSetup
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

import getIndustry from 'containers/common_provider/get_industry/actions';
import {
  getCompanyLogo,
  getCompanyBackground,
} from 'containers/common_provider/get_agency_info_setup/actions';
import {
  makeSelectCompanyLogoResponse,
  makeSelectCompanyBackgroundResponse,
} from 'containers/common_provider/get_agency_info_setup/selectors';
import {
  makeSelectGetIndustryLoading,
  makeSelectGetIndustryResponse,
} from 'containers/common_provider/get_industry/selectors';

import { Button, Col, Form, Row, Select, Tooltip, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import InputColor from 'react-input-color';
import { LoadingOutlined } from '@ant-design/icons';
import HighlightText from 'components/atoms/HighlightText';

import UploadImage from 'images/icons/group-2.png';
import LabelIcon from 'images/icons/group-3.svg';
import A4ReportFile from 'assets/Report.pdf';
import './styles.less';

import { getBase64, imageEncode } from 'utils/companyImageHelper';

const { Option } = Select;

function CompanyInfoFormSetup(props) {
  const {
    user,
    setupToken,
    onSubmit,
    agencyInfo,
    onGetCompanyLogo,
    onGetCompanyBackground,
    logo,
    background,
    onGetIndustry,
    industryLoading,
    industryResponse,
  } = props;
  const [form] = Form.useForm();
  const [loadingLogo, setLoadingLogo] = useState(false);
  // const [loadingBackground, setLoadingBackground] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  // const [backgroundImage, setBackgroundImage] = useState(null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState(null);
  const [industries, setIndustries] = useState([]);

  const [initialFont, setInitialFont] = useState('#333333');
  // const [initialLink, setInitialLink] = useState('#37c9ef');
  // const [initialButton, setInitialButton] = useState('#f59521');
  const [fontColor, setFontColor] = useState({});
  // const [linksColor, setLinkColor] = useState({});
  // const [buttonsColor, setButtonColor] = useState({});

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

  // const uploadBackgroundButton = (
  //   <div className="upload-background-layout">
  //     {loadingBackground ? (
  //       <LoadingOutlined />
  //     ) : (
  //       <>
  //         <img src={UploadImage} className="icon-area" />
  //         <div className="text-area bold-text">
  //           <FormattedMessage {...globalMessages.upload} />
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );

  const updateFontColor = color => {
    setFontColor(color.hex);
  };
  // const updateLinkColor = color => {
  //   setLinkColor(color.hex);
  // };
  // const updateButtonColor = color => {
  //   setButtonColor(color.hex);
  // };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const onFinish = value => {
    const { agency_size, industry } = value;
    const data = {
      logo: companyLogo,
      // background: backgroundImage,
      agencyInfo: {
        company_info: {
          industry,
          // agency_size,
          font_color: fontColor,
          // link_color: linksColor,
          // button_color: buttonsColor,
        },
      },
    };
    onSubmit(data);
  };

  const handleChangeImage = (info, type) => {
    if (info.file.status === 'uploading') {
      if (type == 'logo') {
        setLoadingLogo(true);
      }
      // else if (type == 'background') {
      //   setLoadingBackground(true);
      // }
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        if (type == 'logo') {
          setLoadingLogo(false);
          setCompanyLogo(info.file.originFileObj);
          setPreviewCompanyLogo(imageUrl);
          form.setFieldsValue({
            companyLogo: imageUrl,
          });
        }
        // } else if (type == 'background') {
        //   setLoadingBackground(false);
        //   setBackgroundImage(info.file.originFileObj);
        //   setPreviewBackgroundImage(imageUrl);
        // }
      });
    }
  };

  useEffect(() => {
    if (agencyInfo) {
      const { company_info } = agencyInfo;
      company_info?.font_color && setInitialFont(company_info.font_color);
      // company_info?.link_color && setInitialLink(company_info.link_color);
      // company_info?.button_color && setInitialButton(company_info.button_color);
      company_info?.logo &&
        onGetCompanyLogo(
          setupToken.accessToken,
          agencyInfo.id,
          company_info.logo,
          'logo',
        );
      // company_info?.background_image &&
      //   onGetCompanyBackground(
      //     setupToken.accessToken,
      //     agencyInfo.id,
      //     company_info.background_image,
      //     'background',
      //   );
    }
  }, [agencyInfo]);

  useEffect(() => {
    if (logo && agencyInfo?.company_info?.logo) {
      const { company_info } = agencyInfo;
      const logoPreview = imageEncode(logo);
      const file = new File([logo], company_info.logo, { type: MimeType });
      if (file) setCompanyLogo(file);
      setPreviewCompanyLogo(logoPreview);
      form.setFieldsValue({
        companyLogo: logoPreview,
      });
    }
  }, [logo, agencyInfo]);

  // useEffect(() => {
  //   if (background && agencyInfo?.company_info?.background_image) {
  //     const { company_info } = agencyInfo;
  //     const backgroundPreview = imageEncode(background);
  //     const file = new File([background], company_info.background_image, {
  //       type: MimeType,
  //     });
  //     if (file) setBackgroundImage(file);
  //     setPreviewBackgroundImage(backgroundPreview);
  //   }
  // }, [background, agencyInfo]);

  useEffect(() => {
    if (industryResponse) {
      setIndustries(industryResponse);
    }
  }, [industryResponse]);

  useEffect(() => {
    onGetIndustry();
    return () => {};
  }, []);

  return (
    <Form
      name="basic"
      layout="vertical"
      className="company-info-form"
      onFinish={onFinish}
      form={form}
    >
      <div>
        <Row justify="space-between" gutter={[32, 0]}>
          <Col span={18} offset={3}>
            <Row>
              <Col md={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label={
                    <div className="label-with-tooltip">
                      <FormattedMessage {...messages.companyLogo} />{' '}
                      <Tooltip
                        placement="topLeft"
                        title={
                          <FormattedMessage {...messages.logoDescription} />
                        }
                      >
                        <img src={LabelIcon} className="ml-10" />
                      </Tooltip>
                    </div>
                  }
                  className="logo-upload"
                  name="companyLogo"
                  required={false}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!companyLogo) {
                          return Promise.reject(
                            <FormattedMessage {...messages.logoRequired} />,
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
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
                        src={previewCompanyLogo}
                        alt="company-logo"
                        style={{ width: '100%' }}
                      />
                    ) : (
                      uploadLogoButton
                    )}
                  </Upload>
                  <div className="logo-tips">
                    <FormattedMessage
                      {...messages.logoTips}
                      values={{ br: <br /> }}
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col md={16}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label={<FormattedMessage {...messages.industry} />}
                  name="industry"
                  initialValue={agencyInfo?.company_info?.industry}
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
                      <InputColor
                        initialValue={initialFont}
                        onChange={updateFontColor}
                      />
                    </div>
                    {/* <div className="input-color-item">
                      <span className="input-color-item-message">
                        <FormattedMessage {...messages.links} />
                      </span>
                      <InputColor initialValue={initialLink} onChange={updateLinkColor} />
                    </div>
                    <div className="input-color-item">
                      <span className="input-color-item-message">
                        <FormattedMessage {...messages.buttons} />
                      </span>
                      <InputColor initialValue={initialButton} onChange={updateButtonColor} />
                    </div> */}
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
              <a
                href={A4ReportFile}
                target="_blank"
                className="logo-link color-primary"
              >
                <FormattedMessage {...messages.checkout} />
              </a>
            </HighlightText>
          </span>
        </div>
      </div>

      <Form.Item>
        <div className="checkout__example" />
      </Form.Item>

      <Form.Item className="submit-layout text-center mt-24">
        <Button type="primary" htmlType="submit">
          <FormattedMessage {...globalMessages.next} />
        </Button>
      </Form.Item>
    </Form>
  );
}

CompanyInfoFormSetup.propTypes = {
  user: PropTypes.object,
  setupToken: PropTypes.object,
  editMode: PropTypes.bool,
  agencyInfo: PropTypes.object,
  onGetCompanyLogo: PropTypes.func,
  logo: PropTypes.object,
  background: PropTypes.object,
  onGetCompanyBackground: PropTypes.func,
  onGetIndustry: PropTypes.func,
  industryLoading: PropTypes.bool,
  industryResponse: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  industryLoading: makeSelectGetIndustryLoading(),
  industryResponse: makeSelectGetIndustryResponse(),
  logo: makeSelectCompanyLogoResponse(),
  background: makeSelectCompanyBackgroundResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetIndustry: () => dispatch(getIndustry()),
    onGetCompanyLogo: (accessToken, agencyId, fileId, type) =>
      dispatch(getCompanyLogo(accessToken, agencyId, fileId, type)),
    onGetCompanyBackground: (accessToken, agencyId, fileId, type) =>
      dispatch(getCompanyBackground(accessToken, agencyId, fileId, type)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CompanyInfoFormSetup);
