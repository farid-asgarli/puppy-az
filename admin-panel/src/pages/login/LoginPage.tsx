import { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Alert, Select } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/schemas/loginSchema";
import { useLogin } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/shared/stores/authStore";
import { SUPPORTED_LOCALES, type Locale } from "@/app/i18n";

// Animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-info-600" />

      {/* Animated circles */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-info-400/20 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20" />

      {/* Brand content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-5xl font-bold">🐕</span>
          </motion.div>

          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            puppy<span className="text-primary-200">.az</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md">Admin Panel</p>

          {/* Feature highlights */}
          <motion.div
            className="mt-12 space-y-4 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              "Elanların idarə edilməsi",
              "İstifadəçi idarəetməsi",
              "Kontent administrasiyası",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 text-white/90"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-primary-300" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const sessionExpired = searchParams.get("session") === "expired";

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  const handleLanguageChange = (value: Locale) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Animated area */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <AnimatedBackground />
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Language selector */}
          <div className="flex justify-end mb-8">
            <Select
              value={i18n.language as Locale}
              onChange={handleLanguageChange}
              className="w-32"
              suffixIcon={<GlobalOutlined />}
              options={SUPPORTED_LOCALES.map((locale) => ({
                value: locale,
                label: t(`language.${locale}`),
              }))}
            />
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
              <span className="text-3xl">🐕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              puppy.az
            </h1>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.loginTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Session expired alert */}
          {sessionExpired && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                message={t("auth.sessionExpired")}
                type="warning"
                showIcon
                className="mb-6"
              />
            </motion.div>
          )}

          {/* Login form */}
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email field */}
            <Form.Item
              label={
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {t("auth.username")}
                </span>
              }
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder={t("auth.username")}
                    autoComplete="email"
                    className="rounded-lg"
                  />
                )}
              />
            </Form.Item>

            {/* Password field */}
            <Form.Item
              label={
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {t("auth.password")}
                </span>
              }
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type={showPassword ? "text" : "password"}
                    prefix={<LockOutlined className="text-gray-400" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    }
                    placeholder={t("auth.password")}
                    autoComplete="current-password"
                    className="rounded-lg"
                    onPressEnter={handleSubmit(onSubmit)}
                  />
                )}
              />
            </Form.Item>

            {/* Remember me */}
            <Form.Item>
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("auth.rememberMe")}
                    </span>
                  </Checkbox>
                )}
              />
            </Form.Item>

            {/* Error message */}
            {loginMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert
                  message={t("auth.invalidCredentials")}
                  type="error"
                  showIcon
                  className="mb-4"
                />
              </motion.div>
            )}

            {/* Submit button */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loginMutation.isPending}
                className="h-12 text-base font-semibold rounded-lg"
              >
                {loginMutation.isPending
                  ? t("auth.loggingIn")
                  : t("auth.login")}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>© {new Date().getFullYear()} puppy.az. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
