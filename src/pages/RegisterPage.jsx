import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerSuccess } from "../redux/slices/authSlice.js";
import {
  ArrowRight,
  Building2,
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import authApi from "../api/authApi.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    orgDomain: "",
    logo: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setFormData((prev) => ({
      ...prev,
      logo: file ? file.name : "",
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.orgName.trim() || !formData.orgDomain.trim()) {
      setError("Please complete organization details before continuing.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        org: {
          name: formData.orgName,
          domain: formData.orgDomain,
          logo: logoFile?.name || formData.logo || "logo",
        },
        user: {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      };

      const { data } = await authApi.post("/auth/register", payload);

      dispatch(
        registerSuccess({
          user: {
            id: data.user?.id || Date.now(),
            name: data.user?.name || formData.fullName,
            email: data.user?.email || formData.email,
            avatar: data.user?.avatar || "https://i.pravatar.cc/150?img=1",
          },
          organization: {
            id: data.org?.id || Date.now(),
            name: data.org?.name || formData.orgName,
            slug: data.org?.slug || formData.orgDomain,
          },
        }),
      );
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div
              className={`h-2 rounded-full transition-all ${
                step >= 1 ? "bg-white" : "bg-purple-700"
              }`}
            ></div>
            <p className="text-xs text-purple-300 mt-2">
              Step 1: Organization Details
            </p>
          </div>
          <div className="w-8 mx-3"></div>
          <div className="flex-1">
            <div
              className={`h-2 rounded-full transition-all ${
                step >= 2 ? "bg-white" : "bg-purple-700"
              }`}
            ></div>
            <p className="text-xs text-purple-300 mt-2">
              Step 2: Account Details
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create your workspace
              </h2>
              <p className="text-gray-600 mb-8">
                Get your team connected on the same page
              </p>

              <form onSubmit={handleNextStep} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="orgName"
                      value={formData.orgName}
                      onChange={handleChange}
                      placeholder="Acme Technologies"
                      className="input-base pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Domain
                  </label>
                  <input
                    type="text"
                    name="orgDomain"
                    value={formData.orgDomain}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="input-base"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will identify your workspace
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Logo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full text-sm text-gray-600"
                  />
                  {formData.logo ? (
                    <p className="text-xs text-gray-500 mt-2">
                      Selected file:{" "}
                      <span className="font-medium">{formData.logo}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">
                      Choose a logo file from your computer
                    </p>
                  )}
                </div>

                {error && step === 1 && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Almost there!
              </h2>
              <p className="text-gray-600 mb-8">
                Create your administrator account
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="input-base pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="input-base pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-base pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-base pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && step === 2 && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded border-gray-300 mt-1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 btn-secondary py-3"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Workspace"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
