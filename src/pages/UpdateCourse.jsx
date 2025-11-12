// src/pages/UpdateCourse.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const CATEGORIES = [
  "Web Development",
  "Backend",
  "Programming Languages",
  "Design",
  "Data Science",
  "DevOps",
  "Mobile",
  "UI/UX Design",
  "Digital Marketing",
  "Graphic Design",
];

// 👇 Make sure this matches your server exactly
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FALLBACK_IMG = "https://i.ibb.co/5GzXgmq/avatar.png";

export default function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    price: "",
    duration: "",
    category: "",
    description: "",
    isFeatured: false,
  });

  useEffect(() => {
    document.title = "Update Course - SkillSphere";
    AOS.init({ duration: 800, once: true });
  }, []);

  // --- Load the course ---
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/courses/${id}`, {
        // If your API needs cookies/sessions:
        // withCredentials: true,
        validateStatus: (s) => s >= 200 && s < 300, // only 2xx treated as success
      });
      return res.data;
    },
    enabled: !!id,
  });

  // Normalize object OR [object]
  const course = useMemo(() => {
    if (!data) return null;
    return Array.isArray(data) ? data[0] : data;
  }, [data]);

  // Fill form
  useEffect(() => {
    if (!course) return;
    setForm({
      title: course.title ?? "",
      imageUrl: course.imageUrl ?? course.image ?? "",
      price: String(course.price ?? ""),
      duration: String(course.duration ?? ""),
      category: course.category ?? "",
      description: course.description ?? "",
      isFeatured: Boolean(course.isFeatured),
    });
  }, [course]);

  // Handlers
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const price = Number(form.price);
    const duration = Number(form.duration);
    if (!form.title.trim()) return "Title is required";
    if (!form.imageUrl.trim()) return "Image URL is required";
    if (!form.category) return "Category is required";
    if (!form.description.trim()) return "Description is required";
    if (Number.isNaN(price) || price < 0) return "Invalid price";
    if (Number.isNaN(duration) || duration <= 0) return "Invalid duration (hours)";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    const payload = {
      title: form.title.trim(),
      imageUrl: form.imageUrl.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      category: form.category,
      description: form.description.trim(),
      isFeatured: !!form.isFeatured,
      updatedAt: new Date().toISOString(),
    };

      try {
    setSubmitting(true);
    const { data } = await axios.put(`${API}/courses/${id}`, payload);
    // if you changed server to return {message, data}, both work:
    toast.success("Course updated successfully");
    // optionally: toast.success(data?.message || "Course updated successfully");
    qc.invalidateQueries({ queryKey: ["course", id] });
    qc.invalidateQueries({ queryKey: ["myCourses"] });
    navigate("/dashboard/my-courses");
  } catch (e1) {
    const msg = e1?.response?.data?.message || "Failed to update course. Please try again.";
    toast.error(msg);
  } finally {
    setSubmitting(false);
  }
};

  // UI states
  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card bg-base-200 shadow p-6 text-center">
          <h2 className="font-semibold mb-2">Failed to load course.</h2>
          <div className="card-actions justify-center">
            <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Form ---
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center" data-aos="fade-up">
          Update Course
        </h1>

        <form onSubmit={onSubmit} className="card bg-base-200 shadow-xl p-6" data-aos="fade-up">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text">Course Title *</span>
              </label>
              <input
                type="text"
                name="title"
                required
                className="input input-bordered w-full"
                placeholder="Enter course title"
                value={form.title}
                onChange={onChange}
              />
            </div>

            {/* Image URL with preview */}
            <div>
              <label className="label">
                <span className="label-text">Course Image URL *</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                required
                className="input input-bordered w-full"
                placeholder="https://example.com/course-image.jpg"
                value={form.imageUrl}
                onChange={onChange}
              />
              <div className="mt-2">
                <img
                  src={form.imageUrl || FALLBACK_IMG}
                  alt="Course preview"
                  className="w-32 h-32 object-cover rounded border border-base-300"
                />
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Price ($) *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="input input-bordered w-full"
                  placeholder="0.00"
                  value={form.price}
                  onChange={onChange}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Duration (hours) *</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  required
                  min="1"
                  step="1"
                  className="input input-bordered w-full"
                  placeholder="e.g., 10"
                  value={form.duration}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text">Category *</span>
              </label>
              <select
                name="category"
                required
                className="select select-bordered w-full"
                value={form.category}
                onChange={onChange}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                name="description"
                required
                className="textarea textarea-bordered w-full h-32"
                placeholder="Enter course description"
                value={form.description}
                onChange={onChange}
              />
            </div>

            {/* Featured */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Featured Course</span>
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="toggle toggle-primary"
                  checked={form.isFeatured}
                  onChange={onChange}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="card-actions justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard/my-courses")}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Updating…
                  </>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
