"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { loadSupabaseAllUsers, updateSupabaseUserAccess, createSupabaseUser } from "@/lib/supabase-store";

type DashboardCategoryKey =
  | "news_slider"
  | "news"
  | "gallery"
  | "terminology"
  | "library"
  | "events"
  | "marketplace";

type DashboardField = {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  accept?: string;
};

type LibraryStatField = {
  key: string;
  label: string;
  explanationPlaceholder: string;
  evidencePlaceholder: string;
  captionPlaceholder: string;
};

type DashboardCategory = {
  key: DashboardCategoryKey;
  label: string;
  eyebrow: string;
  description: string;
  fields: DashboardField[];
  statFields?: LibraryStatField[];
};

type DashboardMode = "content" | "users";

type AdminSectionKey =
  | "dashboard"
  | "appearance"
  | "database"
  | "connections"
  | "timezones"
  | "notifications"
  | "user-management"
  | "security-access"
  | "authentication"
  | "payments"
  | "import-data"
  | "export-data";

type DashboardRoleKey = "admin" | "editor" | "scaler" | "moderator";

type DashboardRole = {
  key: DashboardRoleKey;
  label: string;
  description: string;
  allowedCategories: DashboardCategoryKey[];
  canApprove: boolean;
};

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: DashboardRoleKey;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
  dateAdded: string;
  notes: string;
  isMuted?: boolean;
  isBanned?: boolean;
};

type NewUserForm = {
  name: string;
  email: string;
  role: DashboardRoleKey;
  notes: string;
};

const categories: DashboardCategory[] = [
  {
    key: "news_slider",
    label: "News Slider",
    eyebrow: "Homepage Hero",
    description: "Upload banner terbaru untuk slider paling atas.",
    fields: [
      {
        key: "headline",
        label: "Headline",
        placeholder: "Naruto vs Ichigo headline banner",
      },
      {
        key: "image",
        label: "Image Path",
        placeholder: "/images/1.jpg",
      },
      {
        key: "date",
        label: "Date",
        placeholder: "2025-06-04",
        type: "date",
      },
      {
        key: "caption",
        label: "Short Caption",
        placeholder: "Short teaser for the banner",
        multiline: true,
      },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "Explain what the photo shows.",
        multiline: true,
      },
    ],
  },
  {
    key: "news",
    label: "News",
    eyebrow: "Homepage News",
    description: "Upload berita utama, highlight, dan update komunitas.",
    fields: [
      {
        key: "title",
        label: "Title",
        placeholder: "Battleboarding community update",
      },
      {
        key: "description",
        label: "Description",
        placeholder: "Write the news summary here.",
        multiline: true,
      },
      {
        key: "image",
        label: "Image Path",
        placeholder: "/images/news banner.jpg",
      },
      {
        key: "date",
        label: "Date",
        placeholder: "2025-06-04",
        type: "date",
      },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "What does this image support?",
        multiline: true,
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    eyebrow: "Visual Archive",
    description: "Upload gambar untuk section gallery.",
    fields: [
      { key: "title", label: "Title", placeholder: "Gallery scene title" },
      {
        key: "image",
        label: "Image Path",
        placeholder: "/images/2.jpg",
      },
      {
        key: "caption",
        label: "Caption",
        placeholder: "Short caption for the gallery item",
        multiline: true,
      },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "Describe the gallery image.",
        multiline: true,
      },
    ],
  },
  {
    key: "terminology",
    label: "Terminology",
    eyebrow: "Encyclopedia Entry",
    description: "Upload istilah, definisi, dan karakter yang terkait.",
    fields: [
      { key: "term", label: "Term", placeholder: "Gravity Manipulation" },
      {
        key: "definition",
        label: "Definition",
        placeholder: "Explain the term in a short, clear sentence.",
        multiline: true,
      },
      {
        key: "debateUse",
        label: "Debate Use",
        placeholder: "How the term is used in battleboarding.",
        multiline: true,
      },
      {
        key: "commonCharacters",
        label: "Associated Characters",
        placeholder: "Naruto, Gojo, Aizen",
      },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "Describe the evidence image.",
        multiline: true,
      },
    ],
  },
  {
    key: "library",
    label: "Library",
    eyebrow: "Upload Treadh Fiksi",
    description:
      "Disini adalah tempat untuk upload treadh karakter dari berbagai fiksi, ikuti panduan untuk petunjuk cara penggunaan, postingan perlu menunggu persetujuan moderator.",
    fields: [
      {
        key: "character",
        label: "Character Name",
        placeholder: "isi bidang ini, contoh : Naruto Uzumaki",
      },
      { key: "franchise", label: "Franchise", placeholder: "judul fiksi, contoh : Naruto Shipudden" },
      { key: "tier", label: "Tier", placeholder: "contoh : High | 5-B" },
      {
        key: "attackPotency",
        label: "Attack Potency",
        placeholder: "isi bidang ini, contoh : Multi-Continental to Planetary",
      },
      {
        key: "speed",
        label: "Speed",
        placeholder: "isi bidang ini, contoh : FTL+",
      },
      {
        key: "durability",
        label: "Durability",
        placeholder: "isi bidang ini contoh : High | 5-B",
      },
      {
        key: "image",
        label: "Image Path",
        placeholder: "/images/Naruto%20vs%20Ichigo.jpg",
      },
      {
        key: "summary",
        label: "Summary",
        placeholder: "isi bidang ini, contoh : Naruto adalah main character dalam serial Naruto Shippuden yang mempunyai cita cita sebagai hokage",
        multiline: true,
      },
    ],
    statFields: [
      {
        key: "attackPotency",
        label: "Attack Potency",
        explanationPlaceholder: "Explain why the character reaches this AP tier.",
        evidencePlaceholder: "Upload AP evidence image.",
        captionPlaceholder: "Describe the AP evidence image.",
      },
      {
        key: "speed",
        label: "Speed",
        explanationPlaceholder: "Explain how the speed scaling is argued.",
        evidencePlaceholder: "Upload speed evidence image.",
        captionPlaceholder: "Describe the speed evidence image.",
      },
      {
        key: "durability",
        label: "Durability",
        explanationPlaceholder: "Explain the durability scaling.",
        evidencePlaceholder: "Upload durability evidence image.",
        captionPlaceholder: "Describe the durability evidence image.",
      },
      {
        key: "stamina",
        label: "Stamina",
        explanationPlaceholder: "Explain the stamina or endurance scaling.",
        evidencePlaceholder: "Upload stamina evidence image.",
        captionPlaceholder: "Describe the stamina evidence image.",
      },
      {
        key: "range",
        label: "Range",
        explanationPlaceholder: "Explain the character's range profile.",
        evidencePlaceholder: "Upload range evidence image.",
        captionPlaceholder: "Describe the range evidence image.",
      },
      {
        key: "intelligence",
        label: "Intelligence",
        explanationPlaceholder: "Explain the combat IQ or intelligence profile.",
        evidencePlaceholder: "Upload intelligence evidence image.",
        captionPlaceholder: "Describe the intelligence evidence image.",
      },
    ],
  },
  {
    key: "events",
    label: "Events",
    eyebrow: "Weekly Event",
    description: "Upload event announcement dan debat mingguan.",
    fields: [
      {
        key: "title",
        label: "Event Name",
        placeholder: "Naruto vs Ichigo Debate Week",
      },
      {
        key: "description",
        label: "Description",
        placeholder: "Describe the event.",
        multiline: true,
      },
      { key: "date", label: "Date", placeholder: "2025-06-04", type: "date" },
      {
        key: "joinLink",
        label: "Join Link",
        placeholder: "https://discord.gg/your-server",
      },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "Describe the event image.",
        multiline: true,
      },
    ],
  },
  {
    key: "marketplace",
    label: "Marketplace",
    eyebrow: "Product / Service",
    description: "Upload jasa, produk, atau penawaran marketplace.",
    fields: [
      { key: "name", label: "Product Name", placeholder: "Jasa Judgement" },
      {
        key: "description",
        label: "Description",
        placeholder: "Describe the product or service.",
        multiline: true,
      },
      { key: "price", label: "Price Note", placeholder: "Mulai Rp 10.000" },
      { key: "image", label: "Image Path", placeholder: "/images/kk.png" },
      {
        key: "photo",
        label: "Upload Photo",
        placeholder: "",
        type: "file",
        accept: "image/*",
      },
      {
        key: "photoDescription",
        label: "Photo Description",
        placeholder: "Describe the marketplace image.",
        multiline: true,
      },
    ],
  },
];

const roleDefinitions: DashboardRole[] = [
  {
    key: "admin",
    label: "Admin",
    description: "Full access ke semua kategori dan approval workflow.",
    allowedCategories: [
      "news_slider",
      "news",
      "gallery",
      "terminology",
      "library",
      "events",
      "marketplace",
    ],
    canApprove: true,
  },
  {
    key: "editor",
    label: "Editor",
    description: "Fokus ke konten publik seperti news, gallery, dan event.",
    allowedCategories: ["news_slider", "news", "gallery", "events", "marketplace"],
    canApprove: false,
  },
  {
    key: "scaler",
    label: "Scaler",
    description: "Khusus Library dan Terminology, news tetap terkunci.",
    allowedCategories: ["library", "terminology"],
    canApprove: false,
  },
  {
    key: "moderator",
    label: "Moderator",
    description: "Menjaga event, marketplace, dan moderation ringan.",
    allowedCategories: ["events", "marketplace", "gallery"],
    canApprove: false,
  },
];

const initialUsers: DashboardUser[] = [
  {
    id: "user-1",
    name: "Rafi Arjuna",
    email: "rafi@dbarena.com",
    role: "admin",
    status: "Active",
    lastActive: "Today, 08:14",
    dateAdded: "Jul 4, 2022",
    notes: "Super admin and main coordinator.",
  },
  {
    id: "user-2",
    name: "Mika Seno",
    email: "mika@dbarena.com",
    role: "scaler",
    status: "Active",
    lastActive: "Today, 10:33",
    dateAdded: "Jul 4, 2022",
    notes: "Focuses on Library and Terminology posts.",
  },
  {
    id: "user-3",
    name: "Kira Vale",
    email: "kira@dbarena.com",
    role: "editor",
    status: "Invited",
    lastActive: "Yesterday, 21:08",
    dateAdded: "Jul 4, 2022",
    notes: "Handles news and homepage updates.",
  },
];

function getInitialForm(category: DashboardCategoryKey) {
  const config = categories.find((item) => item.key === category);
  const initial: Record<string, string> = {};

  config?.fields.forEach((field) => {
    initial[field.key] = "";
  });

  config?.statFields?.forEach((stat) => {
    initial[`${stat.key}Explanation`] = "";
    initial[`${stat.key}Evidence`] = "";
    initial[`${stat.key}Caption`] = "";
  });

  return initial;
}

export default function DashboardPage() {
  const [mode, setMode] = useState<DashboardMode>("content");
  const [selectedCategory, setSelectedCategory] =
    useState<DashboardCategoryKey>("news");
  const [form, setForm] = useState<Record<string, string>>(
    getInitialForm("news"),
  );
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [users, setUsers] = useState<DashboardUser[]>(
    initialUsers.map((u) => ({ ...u, isMuted: false, isBanned: false }))
  );
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "scaler",
    notes: "",
  });
  const [userSearch, setUserSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeAdminSection, setActiveAdminSection] =
    useState<AdminSectionKey>("user-management");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [manageUser, setManageUser] = useState<DashboardUser | null>(null);
  const [manageForm, setManageForm] = useState<{
    role: DashboardRoleKey;
    status: "Active" | "Invited" | "Suspended";
    isMuted: boolean;
    isBanned: boolean;
    notes: string;
  }>({
    role: "scaler",
    status: "Active",
    isMuted: false,
    isBanned: false,
    notes: "",
  });

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const initialUsersWithMuteBan = initialUsers.map((u) => ({
          ...u,
          isMuted: false,
          isBanned: false,
        }));
        const dbUsers = await loadSupabaseAllUsers(initialUsersWithMuteBan);
        setUsers(dbUsers);
      } catch (err) {
        console.error("Failed to load users from DB, falling back to mock:", err);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleOpenManageModal = (user: DashboardUser) => {
    setManageUser(user);
    setManageForm({
      role: user.role,
      status: user.status,
      isMuted: Boolean(user.isMuted),
      isBanned: Boolean(user.isBanned),
      notes: user.notes || "",
    });
  };

  const handleManageUserSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!manageUser) return;

    try {
      await updateSupabaseUserAccess(manageUser.id, {
        role: manageForm.role,
        status: manageForm.status,
        is_muted: manageForm.isMuted,
        is_banned: manageForm.isBanned,
        notes: manageForm.notes,
      });

      setUsers((current) =>
        current.map((user) =>
          user.id === manageUser.id
            ? {
                ...user,
                role: manageForm.role,
                status: manageForm.status,
                isMuted: manageForm.isMuted,
                isBanned: manageForm.isBanned,
                notes: manageForm.notes,
              }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to update user in database, updating locally anyway:", err);
      setUsers((current) =>
        current.map((user) =>
          user.id === manageUser.id
            ? {
                ...user,
                role: manageForm.role,
                status: manageForm.status,
                isMuted: manageForm.isMuted,
                isBanned: manageForm.isBanned,
                notes: manageForm.notes,
              }
            : user
        )
      );
    }

    setManageUser(null);
  };

  const activeCategory = useMemo(
    () => categories.find((category) => category.key === selectedCategory),
    [selectedCategory],
  );

  const isLibraryCategory = selectedCategory === "library";
  const visibleUsers = users.filter((user) => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  function handleCategoryChange(category: DashboardCategoryKey) {
    setSelectedCategory(category);
    setForm(getInitialForm(category));
    setFilePreviews({});
    setDraftSavedAt(null);
  }

  function getRoleDefinition(role: DashboardRoleKey) {
    return roleDefinitions.find((item) => item.key === role) ?? roleDefinitions[0];
  }

  function getAccessTags(role: DashboardRoleKey) {
    switch (role) {
      case "admin":
        return ["Admin", "Data Export", "Data Import"];
      case "editor":
        return ["Data Export", "Data Import"];
      case "scaler":
        return ["Library", "Terminology"];
      case "moderator":
        return ["Events", "Marketplace"];
      default:
        return [getRoleDefinition(role).label];
    }
  }

  function handleFileChange(key: string, file: File | undefined) {
    setFilePreviews((current) => {
      const next = { ...current };

      if (file) {
        next[key] = URL.createObjectURL(file);
      } else {
        delete next[key];
      }

      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDraftSavedAt(new Date().toLocaleString("en-US"));
  }

  function handleNewUserSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newUser: DashboardUser = {
      id: crypto.randomUUID(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "Invited",
      lastActive: "Just now",
      dateAdded: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      notes: newUserForm.notes,
      isMuted: false,
      isBanned: false,
    };

    setUsers((current) => [newUser, ...current]);

    createSupabaseUser(newUser).catch((err) =>
      console.error("Failed to create user in database:", err)
    );

    setNewUserForm({
      name: "",
      email: "",
      role: "scaler",
      notes: "",
    });
    setIsAddUserOpen(false);
  }

  function renderField(field: DashboardField) {
    if (field.type === "file") {
      return (
        <input
          required
          type="file"
          accept={field.accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            handleFileChange(field.key, file);
            setForm((current) => ({
              ...current,
              [field.key]: file ? file.name : "",
            }));
          }}
          className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
      );
    }

    if (field.multiline) {
      return (
        <textarea
          rows={field.key === "description" ? 4 : 3}
          required
          value={form[field.key] ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              [field.key]: event.target.value,
            }))
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
          placeholder={field.placeholder}
        />
      );
    }

    return (
      <input
        required
        type={field.type ?? "text"}
        value={form[field.key] ?? ""}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            [field.key]: event.target.value,
          }))
        }
        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
        placeholder={field.placeholder}
      />
    );
  }

  function renderGenericPreview() {
    const title =
      form.title || form.headline || form.term || form.name || form.character;
    const description =
      form.description || form.definition || form.debateUse || form.summary;
    const imageSource =
      filePreviews.photo ||
      filePreviews.image ||
      form.image ||
      "/images/1.jpg";

    return (
      <div className="mt-4 grid gap-4">
        <section className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-white">
          <div className="relative aspect-[16/10] bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSource}
              alt={title || activeCategory?.label || "Preview"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/40">
              {activeCategory?.eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-black">
              {title || activeCategory?.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-black/65">
              {description || "Live preview will appear here as you type."}
            </p>
          </div>
        </section>

        <div className="rounded-2xl border border-black/8 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            Preview Notes
          </p>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Ini adalah panel preview untuk mempermudah penataan penampilan sebelum di upload
          </p>
        </div>
      </div>
    );
  }

  function renderLibraryPreview() {
    const statFields = activeCategory?.statFields ?? [];
    const previewImage = filePreviews.image || form.image || "/images/1.jpg";

    return (
      <div className="mt-4 grid gap-4">
        <section className="rounded-[1.5rem] border border-black/8 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="grid gap-4">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.25rem] bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt={form.character || "Library preview"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/40">
                  {form.franchise || "Franchise"}
                </p>
                <h3 className="mt-2 font-display text-4xl uppercase leading-none text-black">
                  {form.character || "Character Name"}
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  {form.summary || "Library summary preview appears here."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  {form.tier || "Tier"}
                </span>
                <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black">
                  Live Preview
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-3">
          {statFields.map((stat) => {
            const explanation = form[`${stat.key}Explanation`];
            const evidenceSrc = filePreviews[`${stat.key}Evidence`];
            const caption = form[`${stat.key}Caption`];

            return (
              <article
                key={stat.key}
                className="rounded-2xl border border-black/8 bg-black/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/40">
                      {stat.label}
                    </p>
                    <h4 className="mt-2 font-display text-3xl uppercase leading-none text-black">
                      {form[stat.key] || "Value preview"}
                    </h4>
                  </div>

                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black">
                    Bukti
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-black/70">
                  {explanation ||
                    `Tulis penjelasan ${stat.label.toLowerCase()} di sini.`}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                    <div className="relative aspect-square bg-black/5">
                      {evidenceSrc ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={evidenceSrc}
                          alt={`${stat.label} evidence preview`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs uppercase tracking-[0.2em] text-black/35">
                          Evidence Preview
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/8 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Deskripsi foto
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/65">
                      {caption || stat.captionPlaceholder}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-black/45">
                      {evidenceSrc
                        ? "Gambar terhubung dari file upload lokal."
                        : "Upload gambar bukti untuk menampilkan preview di sini."}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  function renderAdminPanel() {
    const adminGroups = [
      {
        title: "General",
        items: [
          { key: "dashboard", label: "Dashboard", description: "Workspace overview" },
          { key: "appearance", label: "Appearance", description: "Fonts and visual style" },
          { key: "database", label: "Database", description: "Local data and API plan" },
          { key: "connections", label: "Connections", description: "Discord, WhatsApp, email" },
          { key: "timezones", label: "Timezones", description: "Global upload timing" },
          { key: "notifications", label: "Notifications", description: "System alerts" },
        ],
      },
      {
        title: "DBArena",
        items: [
          { key: "user-management", label: "User management", description: "Team roles and access" },
          { key: "security-access", label: "Security & access", description: "Permission matrix" },
          { key: "authentication", label: "Authentication", description: "Login plan" },
          { key: "payments", label: "Payments", description: "Marketplace handoff" },
          { key: "import-data", label: "Import data", description: "Bring content in" },
          { key: "export-data", label: "Export data", description: "Backup and migration" },
        ],
      },
    ] as const;

    const sectionCopy: Record<
      AdminSectionKey,
      { eyebrow: string; title: string; description: string }
    > = {
      dashboard: {
        eyebrow: "Overview",
        title: "Dashboard",
        description: "Ringkasan cepat aktivitas DBARENA, role, dan area yang sedang paling aktif.",
      },
      appearance: {
        eyebrow: "Brand surface",
        title: "Appearance",
        description: "Gaya visual hitam-putih yang menjaga DBARENA tetap tegas dan mudah dibaca.",
      },
      database: {
        eyebrow: "Data layer",
        title: "Database",
        description: "Data masih lokal dulu, lalu nanti bisa dipindah ke API dan storage yang rapi.",
      },
      connections: {
        eyebrow: "Community links",
        title: "Connections",
        description: "Koneksi untuk Discord, WhatsApp, email, dan jalur komunikasi komunitas.",
      },
      timezones: {
        eyebrow: "Publishing schedule",
        title: "Timezones",
        description: "Atur jam upload untuk komunitas battleboarding internasional lintas zona waktu.",
      },
      notifications: {
        eyebrow: "Updates",
        title: "Notifications",
        description: "Alert ringan untuk upload baru, approval, dan aktivitas penting lain.",
      },
      "user-management": {
        eyebrow: "Team access",
        title: "User management",
        description: "Atur role, akses kategori, dan status tim yang bantu kelola konten DBARENA.",
      },
      "security-access": {
        eyebrow: "Permission control",
        title: "Security & access",
        description: "Lihat role mana yang boleh upload kategori tertentu dan mana yang terkunci.",
      },
      authentication: {
        eyebrow: "Protected routes",
        title: "Authentication",
        description: "Rencana login aman untuk editor, scaler, moderator, dan admin.",
      },
      payments: {
        eyebrow: "Marketplace flow",
        title: "Payments",
        description: "Status pembayaran dan alur order untuk jasa marketplace yang masih manual.",
      },
      "import-data": {
        eyebrow: "Incoming data",
        title: "Import data",
        description: "Masukkan draft, gambar, dan konten baru sebelum disambungkan ke database.",
      },
      "export-data": {
        eyebrow: "Backup",
        title: "Export data",
        description: "Ambil salinan data untuk backup, migrasi, atau pemulihan cepat.",
      },
    };

    const activeSection = sectionCopy[activeAdminSection];
    const activeUser = users[0];
    const activeUsersCount = users.filter((user) => user.status === "Active").length;
    const invitedUsersCount = users.filter((user) => user.status === "Invited").length;
    const timezoneNow = new Date();
    const sectionBadge =
      activeAdminSection === "user-management"
        ? `${visibleUsers.length} members`
        : activeAdminSection === "dashboard"
          ? `${categories.length} categories`
          : "Live preview";

    const dashboardCards = [
      { label: "Total users", value: users.length, note: "Team members in the workspace" },
      { label: "Active users", value: activeUsersCount, note: "Users currently active" },
      { label: "Invited", value: invitedUsersCount, note: "Pending team invitations" },
      { label: "Categories", value: categories.length, note: "Content areas ready to use" },
    ];

    const dashboardActivity = [
      "News slider is ready for new banner artwork.",
      "Library drafts can be limited to scaler-only access.",
      "Marketplace still routes orders through WhatsApp.",
      "Terminology entries stay lightweight and searchable.",
    ];

    const connections = [
      ["Discord", "Weekly debates and community chat", "Ready"],
      ["WhatsApp", "Marketplace order handoff", "Ready"],
      ["Email", "Future approval digest", "Planned"],
      ["Public site", "Homepage and public content routes", "Live"],
    ] as const;

    const notifications = [
      ["New library draft submitted", "Scaler access • 3 min ago", "Pending"],
      ["Terminology entry saved", "Public encyclopedia • 18 min ago", "Review"],
      ["News slider updated", "Homepage banner • 1 hour ago", "Draft"],
      ["Marketplace request received", "WhatsApp handoff • Today, 10:05", "Manual"],
    ] as const;

    const timezoneZones = ["Asia/Bangkok", "UTC", "America/New_York"] as const;

    const renderMain = () => {
      switch (activeAdminSection) {
        case "dashboard":
          return (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dashboardCards.map((card) => (
                  <article key={card.label} className="rounded-[1.5rem] border border-black/8 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      {card.label}
                    </p>
                    <p className="mt-3 font-display text-4xl uppercase leading-none text-black">
                      {card.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-black/60">{card.note}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Activity feed
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    Recent workspace activity
                  </h3>
                  <div className="mt-5 space-y-3">
                    {dashboardActivity.map((item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3 text-sm leading-6 text-black/65"
                      >
                        <span className="mr-2 font-semibold text-black">{index + 1}.</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Workspace notes
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                    <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                      Library dan Terminology menjadi fokus untuk scaler.
                    </div>
                    <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                      News, gallery, dan events tetap jadi jalur upload publik.
                    </div>
                    <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                      Marketplace masih manual lewat WhatsApp sebelum backend siap.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );

        case "appearance":
          return (
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Visual system
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-black">
                  Monochrome brand surface
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                  DBARENA dijaga tetap hitam-putih, clean, dan tegas supaya cocok untuk news,
                  library, terminology, dan dashboard admin.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Font display", "Coolvetica"],
                    ["Body font", "Manrope"],
                    ["Accent color", "Black / White"],
                    ["Card radius", "1.5rem"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-black/8 bg-black/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-black/35">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-black">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Surface palette
                </p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {["#000000", "#111111", "#f8f8f7", "#ffffff"].map((color) => (
                    <div key={color} className="rounded-2xl border border-black/8 bg-white p-3">
                      <div
                        className="h-14 rounded-xl border border-black/8"
                        style={{ backgroundColor: color }}
                      />
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-black/40">
                        {color}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );

        case "database":
          return (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Local state", "Form, preview, dan role list masih client-side."],
                ["Storage", "Data sementara tersimpan di browser."],
                ["Media", "Upload preview pakai file lokal dulu."],
                ["Future stack", "API, DB, dan object storage menyusul."],
              ].map(([label, description]) => (
                <article key={label} className="rounded-[1.5rem] border border-black/8 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    {label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">{description}</p>
                </article>
              ))}
            </div>
          );

        case "connections":
          return (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {connections.map(([label, detail, status]) => (
                <article key={label} className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Channel
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-black">{label}</h3>
                    </div>
                    <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black">
                      {status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-black/60">{detail}</p>
                </article>
              ))}
            </div>
          );

        case "timezones":
          return (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {timezoneZones.map((zone) => (
                <article key={zone} className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    {zone}
                  </p>
                  <p className="mt-3 text-3xl font-display uppercase leading-none text-black">
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone: zone,
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(timezoneNow)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {zone === "Asia/Bangkok"
                      ? "Workspace timezone"
                      : zone === "UTC"
                        ? "Reference clock"
                        : "Community reading window"}
                  </p>
                </article>
              ))}
            </div>
          );

        case "notifications":
          return (
            <div className="mt-6 space-y-3">
              {notifications.map(([title, meta, tone]) => (
                <article
                  key={title}
                  className="rounded-[1.5rem] border border-black/8 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        {meta}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-black">{title}</h3>
                    </div>
                    <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black">
                      {tone}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          );

        case "security-access":
          return (
            <div className="mt-6 space-y-4">
              <section className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-white">
                <div className="grid grid-cols-[1.2fr_1.4fr_140px] gap-4 border-b border-black/8 bg-black/[0.02] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-black/40">
                  <span>Role</span>
                  <span>Allowed access</span>
                  <span>Approve</span>
                </div>
                <div className="divide-y divide-black/8">
                  {roleDefinitions.map((role) => (
                    <div
                      key={role.key}
                      className="grid grid-cols-[1.2fr_1.4fr_140px] gap-4 px-4 py-4 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-black">{role.label}</p>
                        <p className="mt-1 text-xs text-black/50">{role.description}</p>
                      </div>
                      <p className="text-black/65">{getAccessTags(role.key).join(" • ")}</p>
                      <p className="font-medium text-black">{role.canApprove ? "Yes" : "No"}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );

        case "authentication":
          return (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <section className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Planned login flow
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                  <li className="rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
                    Public pages tetap terbuka: homepage, news, library, terminology.
                  </li>
                  <li className="rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
                    Dashboard admin dan approval workflow akan butuh role-based login.
                  </li>
                </ul>
              </section>
              <section className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Security note
                </p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  Saat backend masuk, kita bisa sambungkan email login, token admin, atau provider
                  lain tanpa mengubah layout dashboard.
                </p>
              </section>
            </div>
          );

        case "payments":
          return (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["WhatsApp order flow", "Marketplace masih diarahkan ke chat otomatis wa.me."],
                ["Manual confirmation", "Admin bisa cek order sebelum backend siap."],
                ["Service pricing", "Judgement dan editing punya paket di UI marketplace."],
                ["Future gateway", "Payment provider bisa ditambahkan nanti."],
              ].map(([title, detail]) => (
                <article key={title} className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Payment area
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{detail}</p>
                </article>
              ))}
            </div>
          );

        case "import-data":
          return (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <section className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Supported imports
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["JSON", "CSV", "Images", "Markdown", "Draft notes"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
              <section className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Import checklist
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                  <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                    Map kategori ke news, library, terminology, atau marketplace.
                  </div>
                  <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                    Upload gambar ke preview lokal terlebih dahulu.
                  </div>
                  <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                    Simpan draft untuk approval manual.
                  </div>
                </div>
              </section>
            </div>
          );

        case "export-data":
          return (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <section className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Backup snapshot
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Content export", "News, library, terminology, and events"],
                    ["Media manifest", "Image path references for uploads"],
                    ["User list", "Roles and access settings"],
                    ["Workspace notes", "Draft settings and admin metadata"],
                  ].map(([label, detail]) => (
                    <div key={label} className="rounded-2xl border border-black/8 bg-black/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-black/35">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-black/65">{detail}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Export use case
                </p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  Saat pindah ke database, export dipakai untuk backup lokal, migrasi staging,
                  atau pemulihan cepat.
                </p>
              </section>
            </div>
          );

        case "user-management":
        default:
          return (
            <div className="mt-6">
              <div className="flex flex-col gap-4 border-b border-black/8 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    All users <span className="text-black/45">{users.length}</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-black/55">
                    Team members yang bisa bantu kelola upload, role, dan approval DBARENA.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black/50 shadow-sm">
                    <span className="text-black/35">Search</span>
                    <input
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                      placeholder="member"
                      className="w-32 bg-transparent text-sm text-black outline-none placeholder:text-black/35"
                    />
                  </label>
                  <button
                    type="button"
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/75 shadow-sm transition hover:bg-black/[0.03]"
                  >
                    Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(true)}
                    className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
                  >
                    + Add user
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-black/8 bg-white">
                <div className="grid grid-cols-[28px_minmax(0,1.4fr)_1fr_120px_120px_24px] gap-4 border-b border-black/8 bg-black/[0.02] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-black/40">
                  <span />
                  <span>Member</span>
                  <span>Access</span>
                  <span>Last active</span>
                  <span>Date added</span>
                  <span />
                </div>

                <div className="divide-y divide-black/8">
                  {visibleUsers.map((user) => {
                    const accessTags = getAccessTags(user.role);

                    return (
                      <div
                        key={user.id}
                        className="grid grid-cols-[28px_minmax(0,1.4fr)_1fr_120px_120px_24px] gap-4 px-4 py-4 text-sm text-black"
                      >
                        <div className="pt-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-semibold text-black">
                            {user.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="truncate text-sm font-semibold text-black">{user.name}</p>
                              {user.isMuted && (
                                <span className="rounded-md bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
                                  Muted
                                </span>
                              )}
                              {user.isBanned && (
                                <span className="rounded-md bg-red-50 border border-red-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600 shrink-0">
                                  Banned
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs text-black/50">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {accessTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-black/8 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium text-black/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center text-sm text-black/65">
                          {user.lastActive}
                        </div>

                        <div className="flex items-center text-sm text-black/65">
                          {user.dateAdded}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenManageModal(user)}
                          className="flex items-center justify-center text-sm font-semibold tracking-[0.24em] text-black/45 transition hover:text-black"
                          aria-label={`More actions for ${user.name}`}
                        >
                          More
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`h-9 w-9 rounded-md border text-sm transition ${
                      page === 1
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          );
      }
    };

    return (
      <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
        <div className="grid min-h-[760px] xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="border-b border-black/8 bg-[#fafafa] px-4 py-5 xl:border-b-0 xl:border-r">
            <div className="flex items-center gap-3 border-b border-black/8 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <span className="text-xs font-bold">DB</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">DBARENA</p>
                <p className="text-xs text-black/45">public workspace</p>
              </div>
            </div>

            <div className="mt-4 space-y-5">
              {adminGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    {group.title}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {group.items.map((item) => {
                      const active = activeAdminSection === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setMode("users");
                            setActiveAdminSection(item.key);
                          }}
                          className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                            active
                              ? "bg-black/[0.06] text-black"
                              : "text-black/60 hover:bg-black/[0.03] hover:text-black"
                          }`}
                        >
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-current opacity-70" />
                          <span className="min-w-0">
                            <span className="block font-medium">{item.label}</span>
                            <span className="mt-0.5 block text-xs text-black/55">
                              {item.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1 border-t border-black/8 pt-4">
              {["Settings", "Documentation", "Open in browser"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-black/60 transition hover:bg-black/[0.03] hover:text-black"
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-black/8 px-5 py-4">
              <div className="flex items-center gap-3 text-sm text-black/55">
                <span className="text-black/35">DBARENA</span>
                <span>›</span>
                <span className="font-medium text-black">{activeSection.title}</span>
              </div>

              <div className="flex items-center gap-3">
                {activeUser ? (
                  <div className="flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] px-2 py-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                      {activeUser.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="pr-1">
                      <p className="text-xs font-medium text-black">{activeUser.name}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex-1 px-5 py-6">
              <div className="max-w-6xl">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/35">
                  {activeSection.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                  {activeSection.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-black/55">
                  {activeSection.description}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                    {sectionBadge}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black">
                    {mode === "content" ? "Content upload" : "Admin panel"}
                  </span>
                </div>

                {renderMain()}
              </div>
            </div>
          </section>
        </div>

        {isAddUserOpen ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm"
            onClick={() => setIsAddUserOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-lg rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Add user
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    New team member
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-black/70 transition hover:bg-black/[0.03]"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleNewUserSubmit} className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Name</span>
                    <input
                      required
                      value={newUserForm.name}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Florence Shaw"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Email</span>
                    <input
                      required
                      type="email"
                      value={newUserForm.email}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      placeholder="florence@dbarena.com"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Role</span>
                    <select
                      value={newUserForm.role}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          role: event.target.value as DashboardRoleKey,
                        }))
                      }
                      className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    >
                      {roleDefinitions.map((role) => (
                        <option key={role.key} value={role.key}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Notes</span>
                    <input
                      value={newUserForm.notes}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Optional notes"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-black/8 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="rounded-md border border-black/10 px-4 py-2 text-sm text-black transition hover:bg-black/[0.03]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Save user
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {manageUser ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm"
            onClick={() => setManageUser(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-lg rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Manage Member
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    {manageUser.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setManageUser(null)}
                  className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-black/70 transition hover:bg-black/[0.03]"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleManageUserSubmit} className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60">Role</span>
                    <select
                      value={manageForm.role}
                      onChange={(event) =>
                        setManageForm((current) => ({
                          ...current,
                          role: event.target.value as DashboardRoleKey,
                        }))
                      }
                      className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    >
                      {roleDefinitions.map((role) => (
                        <option key={role.key} value={role.key}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60">Status</span>
                    <select
                      value={manageForm.status}
                      onChange={(event) =>
                        setManageForm((current) => ({
                          ...current,
                          status: event.target.value as any,
                        }))
                      }
                      className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    >
                      <option value="Active">Active</option>
                      <option value="Invited">Invited</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60">Mute User</span>
                    <button
                      type="button"
                      onClick={() =>
                        setManageForm((current) => ({
                          ...current,
                          isMuted: !current.isMuted,
                        }))
                      }
                      className={`h-11 rounded-md border text-sm font-semibold uppercase tracking-wider transition ${
                        manageForm.isMuted
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]"
                      }`}
                    >
                      {manageForm.isMuted ? "🔇 Muted" : "🔊 Active"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60">Ban User</span>
                    <button
                      type="button"
                      onClick={() =>
                        setManageForm((current) => ({
                          ...current,
                          isBanned: !current.isBanned,
                          status: !current.isBanned ? "Suspended" : "Active",
                        }))
                      }
                      className={`h-11 rounded-md border text-sm font-semibold uppercase tracking-wider transition ${
                        manageForm.isBanned
                          ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                          : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]"
                      }`}
                    >
                      {manageForm.isBanned ? "🚫 Banned" : "✅ Unbanned"}
                    </button>
                  </div>
                </div>

                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-black/60">Admin Notes</span>
                  <textarea
                    value={manageForm.notes}
                    onChange={(event) =>
                      setManageForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="E.g., Muted for inappropriate language in debates."
                    className="rounded-md border border-black/10 px-3 py-2 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    rows={3}
                  />
                </label>

                <div className="flex justify-end gap-2 border-t border-black/8 pt-4">
                  <button
                    type="button"
                    onClick={() => setManageUser(null)}
                    className="rounded-md border border-black/10 px-4 py-2 text-sm text-black transition hover:bg-black/[0.03]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderUserManagement() {
    return renderAdminPanel();

    const sidebarSections = [
      {
        title: "General",
        items: ["Dashboard", "Appearance", "Database", "Connections", "Timezones", "Notifications"],
      },
      {
        title: "Syphus Ventures",
        items: ["User management", "Security & access", "Authentication", "Payments", "Import data", "Export data"],
      },
    ];

    const activeUser = users[0];

    return (
      <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
        <div className="grid min-h-[760px] xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="border-b border-black/8 bg-[#fafafa] px-4 py-5 xl:border-b-0 xl:border-r">
            <div className="flex items-center gap-3 border-b border-black/8 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <span className="text-xs font-bold">UI</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Untitled UI</p>
                <p className="text-xs text-black/45">v4.0</p>
              </div>
            </div>

            <div className="mt-4 space-y-5">
              {sidebarSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    {section.title}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {section.items.map((item) => {
                      const active = item === "User management";
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            if (item === "User management") setMode("users");
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                            active
                              ? "bg-black/[0.06] font-medium text-black"
                              : "text-black/60 hover:bg-black/[0.03] hover:text-black"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1 border-t border-black/8 pt-4">
              {["Settings", "Documentation", "Open in browser"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-black/60 transition hover:bg-black/[0.03] hover:text-black"
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-black/8 px-5 py-4">
              <div className="flex items-center gap-3 text-sm text-black/55">
                <span className="text-black/35">Sisyphus Ventures</span>
                <span>›</span>
                <span className="font-medium text-black">User management</span>
              </div>

              <div className="flex items-center gap-3">
                {activeUser ? (
                  <div className="flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] px-2 py-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                      {activeUser.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="pr-1">
                      <p className="text-xs font-medium text-black">{activeUser.name}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex-1 px-5 py-6">
              <div className="max-w-6xl">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/35">
                  User management
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                  User management
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Manage your team members and their account permissions here.
                </p>

                <div className="mt-6 flex flex-col gap-4 border-b border-black/8 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      All users <span className="text-black/45">{users.length}</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black/50 shadow-sm">
                      <span className="text-black/35">⌕</span>
                      <input
                        value={userSearch}
                        onChange={(event) => setUserSearch(event.target.value)}
                        placeholder="Search"
                        className="w-32 bg-transparent text-sm text-black outline-none placeholder:text-black/35"
                      />
                    </label>
                    <button
                      type="button"
                      className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/75 shadow-sm transition hover:bg-black/[0.03]"
                    >
                      Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(true)}
                      className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
                    >
                      + Add user
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-black/8">
                  <div className="grid grid-cols-[28px_minmax(0,1.4fr)_1fr_120px_120px_24px] gap-4 border-b border-black/8 bg-black/[0.02] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-black/40">
                    <span />
                    <span>User name</span>
                    <span>Access</span>
                    <span>Last active ↕</span>
                    <span>Date added</span>
                    <span />
                  </div>

                  <div className="divide-y divide-black/8">
                    {visibleUsers.map((user) => {
                      const accessTags = getAccessTags(user.role);

                      return (
                        <div
                          key={user.id}
                          className="grid grid-cols-[28px_minmax(0,1.4fr)_1fr_120px_120px_24px] gap-4 px-4 py-4 text-sm text-black"
                        >
                          <div className="pt-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
                          </div>

                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-semibold text-black">
                              {user.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-black">
                                {user.name}
                              </p>
                              <p className="truncate text-xs text-black/50">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {accessTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-black/8 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium text-black/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center text-sm text-black/65">
                            {user.lastActive}
                          </div>

                          <div className="flex items-center text-sm text-black/65">
                            {user.dateAdded}
                          </div>

                          <button
                            type="button"
                            className="flex items-center justify-center text-lg leading-none text-black/45 transition hover:text-black"
                            aria-label={`More actions for ${user.name}`}
                          >
                            ⋮
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`h-9 w-9 rounded-md border text-sm transition ${
                        page === 1
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {isAddUserOpen ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm"
            onClick={() => setIsAddUserOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-lg rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Add user
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    New team member
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-black/70 transition hover:bg-black/[0.03]"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleNewUserSubmit} className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Name</span>
                    <input
                      required
                      value={newUserForm.name}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Florence Shaw"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Email</span>
                    <input
                      required
                      type="email"
                      value={newUserForm.email}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      placeholder="florence@dbarena.com"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Role</span>
                    <select
                      value={newUserForm.role}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          role: event.target.value as DashboardRoleKey,
                        }))
                      }
                      className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    >
                      {roleDefinitions.map((role) => (
                        <option key={role.key} value={role.key}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">Notes</span>
                    <input
                      value={newUserForm.notes}
                      onChange={(event) =>
                        setNewUserForm((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Optional notes"
                      className="rounded-md border border-black/10 px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-black/8 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="rounded-md border border-black/10 px-4 py-2 text-sm text-black transition hover:bg-black/[0.03]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Save user
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8f8f7_0%,_#efefec_100%)] text-black">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Upload Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
              Ajukan upload per kategori. Semua perubahan sekarang bisa kamu cek
              langsung lewat live preview di sisi kanan.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            Back
          </Link>
        </header>

        <div className="mb-6 inline-flex rounded-full border border-black/10 bg-white p-1 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={() => setMode("content")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "content"
                ? "bg-black text-white"
                : "text-black/65 hover:text-black"
            }`}
          >
            Content Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("users")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "users"
                ? "bg-black text-white"
                : "text-black/65 hover:text-black"
            }`}
          >
            User Management
          </button>
        </div>

        {mode === "content" ? (
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_360px]">
            <aside className="rounded-[1rem] border border-black/8 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Categories
              </p>
              <div className="mt-4 space-y-2">
                {categories.map((category) => {
                  const active = selectedCategory === category.key;
                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => handleCategoryChange(category.key)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-black/8 bg-white text-black hover:border-black/20 hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm font-medium ${
                              active ? "text-white" : "text-black"
                            }`}
                          >
                            {category.label}
                          </p>
                          <p
                            className={`truncate text-xs ${
                              active ? "text-white/65" : "text-black/45"
                            }`}
                          >
                            {category.eyebrow}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 text-xs ${
                            active ? "text-white/60" : "text-black/30"
                          }`}
                        >
                          {String(category.fields.length).padStart(2, "0")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-[1rem] border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                    Selected Category
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-black">
                    {activeCategory?.label}
                  </h2>
                  <p className="mt-1 text-sm text-black/60">
                    {activeCategory?.description}
                  </p>
                </div>

                <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  Draft
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                {activeCategory?.fields.map((field) => (
                  <label key={field.key} className="grid gap-1.5">
                    <span className="text-sm font-medium text-black/75">
                      {field.label}
                    </span>
                    {renderField(field)}
                  </label>
                ))}

                {isLibraryCategory && activeCategory?.statFields ? (
                  <section className="mt-2 grid gap-4 rounded-2xl border border-black/8 bg-black/[0.02] p-4 sm:p-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                        Per-Category Evidence
                      </p>
                      <p className="text-sm text-black/55">
                        Setiap stat bisa punya penjelasan dan bukti foto masing-
                        masing seperti di halaman library detail.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {activeCategory.statFields.map((stat) => (
                        <article
                          key={stat.key}
                          className="rounded-2xl border border-black/8 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                                {stat.label}
                              </p>
                              <h3 className="mt-2 text-lg font-semibold text-black">
                                Evidence Upload
                              </h3>
                            </div>
                            <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                              Required
                            </span>
                          </div>

                          <div className="mt-4 grid gap-4">
                            <label className="grid gap-1.5">
                              <span className="text-sm font-medium text-black/75">
                                {stat.label} Explanation
                              </span>
                              <textarea
                                rows={4}
                                required
                                value={form[`${stat.key}Explanation`] ?? ""}
                                onChange={(event) =>
                                  setForm((current) => ({
                                    ...current,
                                    [`${stat.key}Explanation`]: event.target
                                      .value,
                                  }))
                                }
                                placeholder={stat.explanationPlaceholder}
                                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                              />
                            </label>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="grid gap-1.5">
                                <span className="text-sm font-medium text-black/75">
                                  {stat.label} Proof Image
                                </span>
                                <input
                                  required
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    handleFileChange(`${stat.key}Evidence`, file);
                                    setForm((current) => ({
                                      ...current,
                                      [`${stat.key}Evidence`]: file
                                        ? file.name
                                        : "",
                                    }));
                                  }}
                                  className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
                                />
                              </label>

                              <label className="grid gap-1.5">
                                <span className="text-sm font-medium text-black/75">
                                  {stat.label} Photo Description
                                </span>
                                <input
                                  required
                                  value={form[`${stat.key}Caption`] ?? ""}
                                  onChange={(event) =>
                                    setForm((current) => ({
                                      ...current,
                                      [`${stat.key}Caption`]: event.target.value,
                                    }))
                                  }
                                  placeholder={stat.captionPlaceholder}
                                  className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                                />
                              </label>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Save preview
                </button>

                {draftSavedAt ? (
                  <p className="text-xs text-black/45">
                    Draft refreshed at {draftSavedAt}
                  </p>
                ) : null}
              </form>
            </section>

            <aside className="rounded-[1rem] border border-black/8 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div className="overflow-hidden rounded-[1rem] border border-black/8 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      Preview
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-black">
                      Live Result
                    </h2>
                  </div>
                </div>

                {isLibraryCategory ? renderLibraryPreview() : renderGenericPreview()}
              </div>
            </aside>
          </div>
        ) : (
          renderUserManagement()
        )}
      </main>
    </div>
  );
}
