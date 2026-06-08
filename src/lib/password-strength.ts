export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export type PasswordStrengthResult = {
  score: number;
  strength: PasswordStrength;
  label: string;
  color: string;
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const strengthMap: Record<
    number,
    { strength: PasswordStrength; label: string; color: string }
  > = {
    0: { strength: "weak", label: "Weak", color: "bg-danger" },
    1: { strength: "weak", label: "Weak", color: "bg-danger" },
    2: { strength: "fair", label: "Fair", color: "bg-warning" },
    3: { strength: "good", label: "Good", color: "bg-info" },
    4: { strength: "good", label: "Good", color: "bg-info" },
    5: { strength: "strong", label: "Strong", color: "bg-success" },
  };

  const result = strengthMap[score] ?? strengthMap[0];

  return {
    score,
    strength: result.strength,
    label: result.label,
    color: result.color,
    checks,
  };
}
