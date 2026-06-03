"use client";

import DashboardLoginCard from "../../components/dashboard/auth/DashboardLoginCard";
import useDashboardLogin from "../../hooks/dashboard/useDashboardLogin";

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isSubmitting,
    onSubmit,
  } = useDashboardLogin();

  return (
    <DashboardLoginCard
      email={email}
      password={password}
      message={message}
      isSubmitting={isSubmitting}
      onEmailChange={(event) => setEmail(event.target.value)}
      onPasswordChange={(event) => setPassword(event.target.value)}
      onSubmit={onSubmit}
    />
  );
}
