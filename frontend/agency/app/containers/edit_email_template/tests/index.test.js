/**
 *
 * Tests for EditEmailTemplate
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import { EditEmailTemplate } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<EditEmailTemplate />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    const dispatch = jest.fn();
    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <EditEmailTemplate dispatch={dispatch} />
      </IntlProvider>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('Expect to have additional unit tests specified', () => {
    expect(true).toEqual(false);
  });

  /**
   * Unskip this test to use it
   *
   * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
   */
  it.skip('Should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <EditEmailTemplate />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});


{/* <FormInfoDetail
  case='use-form'
  initialValues={templateInfoData}
  enableReinitialize
  onSubmit={(values, b) => handleOk(values)}


>
  <div className="border-wrapper">

    <Row
      // align="right"

      gutter={[
        { xs: 8, sm: 16, md: 24, lg: 32 },
        { xs: 8, sm: 16, md: 24, lg: 32 },
      ]}
    >
      <Col xs={24} sm={12} md={12} lg={6} >
        <InputCustom
          styleformgroup={`mb- 20`}
          label="Template Name"
          name="name"
          type="text" >

        </InputCustom>
      </Col>

      <Col xs={24} sm={12} md={12} lg={4} >

        <SelectCustom
          styleformgroup={`mb-20`}
          label="Type"
          id="type"
          name="type"
          options={options}
          defaultValue={1}
        >


        </SelectCustom>
      </Col>






      <Col xs={24} sm={12} md={12} lg={7} offset={5} >
        <Row justify='space-between' align='middle' className={'action'}>




          <Col lg={12} sm={12}>
            <Button className='btn-hotpink-outline w-150 ' type='button' onClick={() => console.log('cancdle')}> Cancel</Button>
          </Col>
          <Col lg={12} sm={12}>
            <Button className='btn-primary-gradient w-150' type='submit'> Save</Button>

          </Col>
        </Row>

      </Col>
    </Row>
  </div>

  <Row
    justify="start"

    gutter={[
      { xs: 8, sm: 16, md: 24, lg: 32 },
      { xs: 8, sm: 16, md: 24, lg: 32 },
    ]}
    style={{ padding: '40px 0' }}
  >
    <Col xs={24} sm={12} md={12} lg={24} >
      <InputCustom
        styleformgroup={`mb- 20`}
        label="Subject"
        name='subject'
        type="text" >

      </InputCustom>
    </Col>
  </Row>

  <Row
    justify="start"

    gutter={[
      { xs: 8, sm: 16, md: 24, lg: 32 },
      { xs: 8, sm: 16, md: 24, lg: 32 },
    ]}
    style={{ padding: '40px 0' }}
  >


    <Col lg={24}>
      <CKEditor
        key={`resume_linked`}
        editor={InlineEditor}
        label="Content"
        name='content'
        type="text"
        data={mailTemplateInfo?.content}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          // setFieldValue('content', data);
        }}
      >

      </CKEditor>
    </Col>
  </Row>

  <Row>



  </Row>




  <h4> Note: this is a private link, so only you can view the shortlisted candidates.</h4>




</FormInfoDetail>
 */}
