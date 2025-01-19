import { useFormik } from "formik";
import React, { useCallback, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import withRouter from "../../components/withRouter";

import { apiError, loginUser } from "../../redux/actions";

import {
  default as logodark,
  default as logolight,
} from "../../assets/images/bito_logo_mark.png";

/**
 * ログイン画面
 * @param {*} props
 */
const Login = (props) => {
  const dispatch = useDispatch();
  const clearError = useCallback(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  // validation
  const formik = useFormik({
    initialValues: {
      op_id: "",
      pwd: "",
    },
    validationSchema: Yup.object({
      op_id: Yup.string().required("ユーザーIDを入力してください"),
      pwd: Yup.string().required("パスワードを入力してください"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  if (localStorage.getItem("authUser")) {
    return <Navigate to="/" />;
  }

  document.title = "Login | Chatvia React - Responsive Bootstrap 5 Chat App";

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="text-center mb-4">
                <Link to="/" className="auth-logo mb-5 d-block">
                  <img
                    src={logodark}
                    alt=""
                    height="80"
                    className="logo logo-dark"
                  />
                  <img
                    src={logolight}
                    alt=""
                    height="80"
                    className="logo logo-light"
                  />
                </Link>
                <h4>ログイン</h4>
              </div>

              <Card>
                <CardBody className="p-4">
                  {props.error && <Alert color="danger">{props.error}</Alert>}
                  <div className="p-3">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Label className="form-label">ユーザーID</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3">
                          <span
                            className="input-group-text text-muted"
                            id="basic-addon3"
                          >
                            <i className="ri-user-2-line"></i>
                          </span>
                          <Input
                            type="text"
                            id="op_id"
                            name="op_id"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="ユーザーIDを入力してください"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.op_id}
                            invalid={
                              formik.touched.op_id && formik.errors.op_id
                                ? true
                                : false
                            }
                          />
                          {formik.touched.op_id && formik.errors.op_id ? (
                            <FormFeedback type="invalid">
                              {formik.errors.op_id}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </div>

                      <FormGroup className="mb-4">
                        <Label className="form-label">パスワード</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3">
                          <span className="input-group-text text-muted">
                            <i className="ri-lock-2-line"></i>
                          </span>
                          <Input
                            type="password"
                            id="pwd"
                            name="pwd"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="パスワードを入力してください"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pwd}
                            invalid={
                              formik.touched.pwd && formik.errors.pwd
                                ? true
                                : false
                            }
                          />
                          {formik.touched.pwd && formik.errors.pwd ? (
                            <FormFeedback type="invalid">
                              {formik.errors.pwd}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div className="form-check mb-4">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="remember-check"
                        >
                          パスワードを保存する
                        </Label>
                      </div>

                      <div className="d-grid">
                        <Button
                          color="primary"
                          block
                          className=" waves-effect waves-light"
                          type="submit"
                        >
                          ログイン
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()}{" "}
                  <i className="mdi mdi-heart text-danger"></i>{" "}
                  株式会社CTI情報センター
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { user, loading, error } = state.Auth;
  return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { apiError })(Login));
