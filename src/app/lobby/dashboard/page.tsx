"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/aceternity/animated-modal";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";
import { BackgroundGradient } from "@/components/aceternity/background-gradient";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { HoverBorderGradient } from "@/components/aceternity/hover-border-gradient";
import { FloatingNav } from "@/components/aceternity/floating-navbar";
import { Spotlight } from "@/components/aceternity/spotlight";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { FileUpload } from "@/components/aceternity/file-upload";
import { Meteors } from "@/components/aceternity/meteors";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Upload,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

// Types based on the SQL schema (camelCase)
interface Article {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  summary: string;
  views: number;
  readingTime: number;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  publishedBy?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  category?: Category;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "staff" | "user";
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface Redirect {
  id: string;
  fromUrl: string;
  toUrl: string;
  isActive: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface FileUploadItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
}

interface Analytics {
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalRedirects: number;
  totalFiles: number;
  totalUsers: number;
  recentActivity: {
    articles: number;
    redirects: number;
    files: number;
  };
}

// Mock data
const mockAnalytics: Analytics = {
  totalArticles: 156,
  publishedArticles: 142,
  totalViews: 45672,
  totalRedirects: 89,
  totalFiles: 234,
  totalUsers: 1247,
  recentActivity: {
    articles: 12,
    redirects: 5,
    files: 23,
  },
};

const mockArticles: Article[] = [
  {
    id: "1",
    categoryId: "cat-1",
    title: "Getting Started with Next.js 14",
    content: "This is a comprehensive guide to Next.js 14...",
    summary:
      "Learn the fundamentals of Next.js 14 and build modern web applications",
    views: 1250,
    readingTime: 480,
    slug: "getting-started-nextjs-14",
    isPublished: true,
    isFeatured: true,
    publishedAt: "2024-01-15T10:00:00Z",
    publishedBy: "user-1",
    createdAt: "2024-01-14T10:00:00Z",
    createdBy: "user-1",
    updatedAt: "2024-01-15T10:00:00Z",
    updatedBy: "user-1",
    category: {
      id: "cat-1",
      name: "Development",
      slug: "development",
      color: "#3B82F6",
      isActive: true,
      sortOrder: 1,
    },
  },
  {
    id: "2",
    categoryId: "cat-2",
    title: "The Future of AI in Web Development",
    content: "Exploring how AI is revolutionizing web development...",
    summary:
      "Discover the latest AI tools and techniques transforming web development",
    views: 890,
    readingTime: 360,
    slug: "future-ai-web-development",
    isPublished: true,
    isFeatured: false,
    publishedAt: "2024-01-12T14:30:00Z",
    publishedBy: "user-2",
    createdAt: "2024-01-11T14:30:00Z",
    createdBy: "user-2",
    updatedAt: "2024-01-12T14:30:00Z",
    updatedBy: "user-2",
    category: {
      id: "cat-2",
      name: "AI & Technology",
      slug: "ai-technology",
      color: "#8B5CF6",
      isActive: true,
      sortOrder: 2,
    },
  },
];

const mockRedirects: Redirect[] = [
  {
    id: "1",
    fromUrl: "/old-blog",
    toUrl: "/articles",
    isActive: true,
    clicks: 234,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    fromUrl: "/legacy-docs",
    toUrl: "/documentation",
    isActive: true,
    clicks: 156,
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
];

const mockFiles: FileUploadItem[] = [
  {
    id: "1",
    filename: "hero-image-2024.jpg",
    originalName: "hero-image.jpg",
    mimeType: "image/jpeg",
    size: 245760,
    url: "/uploads/hero-image-2024.jpg",
    category: "images",
    uploadedBy: "user-1",
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "2",
    filename: "documentation.pdf",
    originalName: "API Documentation.pdf",
    mimeType: "application/pdf",
    size: 1024000,
    url: "/uploads/documentation.pdf",
    category: "documents",
    uploadedBy: "user-2",
    createdAt: "2024-01-14T16:45:00Z",
  },
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [redirects, setRedirects] = useState<Redirect[]>(mockRedirects);
  const [files, setFiles] = useState<FileUploadItem[]>(mockFiles);
  const [analytics] = useState<Analytics>(mockAnalytics);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    summary: "",
    categoryId: "",
  });

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  const handleArticleSubmit = () => {
    if (newArticle.title && newArticle.content && newArticle.summary) {
      const article: Article = {
        id: Date.now().toString(),
        categoryId: newArticle.categoryId || "cat-1",
        title: newArticle.title,
        content: newArticle.content,
        summary: newArticle.summary,
        views: 0,
        readingTime: Math.ceil(newArticle.content.length / 200) * 60,
        slug: newArticle.title.toLowerCase().replace(/\s+/g, "-"),
        isPublished: false,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        createdBy: "current-user",
        updatedAt: new Date().toISOString(),
        updatedBy: "current-user",
      };
      setArticles([article, ...articles]);
      setNewArticle({ title: "", content: "", summary: "", categoryId: "" });
      setIsCreatingArticle(false);
    }
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const fileItem: FileUploadItem = {
        id: Date.now().toString() + Math.random(),
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${Date.now()}-${file.name}`,
        category: file.type.startsWith("image/") ? "images" : "documents",
        uploadedBy: "current-user",
        createdAt: new Date().toISOString(),
      };
      setFiles((prev) => [fileItem, ...prev]);
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navItems = [
    {
      name: "Analytics",
      link: "#analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      name: "Articles",
      link: "#articles",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "Redirects",
      link: "#redirects",
      icon: <ExternalLink className="h-4 w-4" />,
    },
    { name: "Files", link: "#files", icon: <Upload className="h-4 w-4" /> },
  ];

  const AnalyticsCard = ({ title, value, change, icon: Icon, color }: any) => (
    <CardSpotlight className="h-40 w-full">
      <div className="relative h-full p-6">
        <Meteors number={10} />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {change && (
              <p
                className={cn(
                  "text-sm mt-2 flex items-center",
                  change > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {change > 0 ? "+" : ""}
                {change}% this month
              </p>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-full",
              `bg-${color}-100 dark:bg-${color}-900/20`
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                `text-${color}-600 dark:text-${color}-400`
              )}
            />
          </div>
        </div>
      </div>
    </CardSpotlight>
  );

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode ? "dark bg-black" : "bg-gray-50"
      )}
    >
      <AuroraBackground className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50" />
      </AuroraBackground>

      <Spotlight className="fixed top-0 left-0 -z-5" />

      <FloatingNav navItems={navItems} className="top-4" />

      <div className="container mx-auto px-4 pt-20 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <TextGenerateEffect
              words="Content Management Dashboard"
              className="text-4xl font-bold text-gray-900 dark:text-white"
            />
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your content, analytics, and more
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </HoverBorderGradient>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg mb-8"
        >
          {[
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "articles", label: "Articles", icon: FileText },
            { id: "redirects", label: "Redirects", icon: ExternalLink },
            { id: "files", label: "Files", icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Total Articles"
                  value={analytics.totalArticles}
                  change={15}
                  icon={FileText}
                  color="blue"
                />
                <AnalyticsCard
                  title="Total Views"
                  value={analytics.totalViews.toLocaleString()}
                  change={23}
                  icon={Eye}
                  color="green"
                />
                <AnalyticsCard
                  title="Total Redirects"
                  value={analytics.totalRedirects}
                  change={8}
                  icon={ExternalLink}
                  color="purple"
                />
                <AnalyticsCard
                  title="Total Files"
                  value={analytics.totalFiles}
                  change={12}
                  icon={Upload}
                  color="orange"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        New Articles
                      </span>
                      <span className="font-semibold text-blue-600">
                        {analytics.recentActivity.articles}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        New Redirects
                      </span>
                      <span className="font-semibold text-purple-600">
                        {analytics.recentActivity.redirects}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Files Uploaded
                      </span>
                      <span className="font-semibold text-orange-600">
                        {analytics.recentActivity.files}
                      </span>
                    </div>
                  </div>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Top Performing Articles
                  </h3>
                  <div className="space-y-4">
                    {articles.slice(0, 3).map((article, index) => (
                      <div
                        key={article.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {article.views} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </BackgroundGradient>
              </div>
            </motion.div>
          )}

          {/* Articles Tab */}
          {activeTab === "articles" && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Articles
                </h2>
                <Modal>
                  <ModalTrigger>
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                      onClick={() => setIsCreatingArticle(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </HoverBorderGradient>
                  </ModalTrigger>
                  <ModalBody>
                    <ModalContent>
                      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                        Create New Article
                      </h4>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Article Title"
                          value={newArticle.title}
                          onChange={(e) =>
                            setNewArticle({
                              ...newArticle,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <textarea
                          placeholder="Article Summary"
                          value={newArticle.summary}
                          onChange={(e) =>
                            setNewArticle({
                              ...newArticle,
                              summary: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <textarea
                          placeholder="Article Content"
                          value={newArticle.content}
                          onChange={(e) =>
                            setNewArticle({
                              ...newArticle,
                              content: e.target.value,
                            })
                          }
                          rows={8}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </ModalContent>
                    <ModalFooter className="gap-4">
                      <button
                        onClick={handleArticleSubmit}
                        className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                      >
                        Create
                      </button>
                    </ModalFooter>
                  </ModalBody>
                </Modal>
              </div>

              <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Title
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Views
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Created
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr
                          key={article.id}
                          className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {article.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {article.summary}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                article.isPublished
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              )}
                            >
                              {article.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {article.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                            {formatDate(article.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Modal>
                                <ModalTrigger>
                                  <button
                                    onClick={() => setSelectedArticle(article)}
                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </ModalTrigger>
                                <ModalBody>
                                  <ModalContent>
                                    {selectedArticle && (
                                      <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                          <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold">
                                            {selectedArticle.title}
                                          </h4>
                                          <span
                                            className={cn(
                                              "px-2 py-1 rounded-full text-xs font-medium",
                                              selectedArticle.isPublished
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                            )}
                                          >
                                            {selectedArticle.isPublished
                                              ? "Published"
                                              : "Draft"}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Views:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                              {selectedArticle.views}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Reading Time:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                              {Math.ceil(
                                                selectedArticle.readingTime / 60
                                              )}{" "}
                                              min
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Created:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                              {formatDate(
                                                selectedArticle.createdAt
                                              )}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Category:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                              {selectedArticle.category?.name}
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Summary
                                          </h5>
                                          <p className="text-gray-600 dark:text-gray-400">
                                            {selectedArticle.summary}
                                          </p>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Content
                                          </h5>
                                          <div className="max-h-60 overflow-y-auto text-gray-600 dark:text-gray-400">
                                            {selectedArticle.content}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </ModalContent>
                                </ModalBody>
                              </Modal>
                              <button className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BackgroundGradient>
            </motion.div>
          )}

          {/* Redirects Tab */}
          {activeTab === "redirects" && (
            <motion.div
              key="redirects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Redirects
                </h2>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Redirect
                </HoverBorderGradient>
              </div>

              <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          From URL
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          To URL
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Clicks
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {redirects.map((redirect) => (
                        <tr
                          key={redirect.id}
                          className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                            {redirect.fromUrl}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                            {redirect.toUrl}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {redirect.clicks}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                redirect.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                              )}
                            >
                              {redirect.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BackgroundGradient>
            </motion.div>
          )}

          {/* Files Tab */}
          {activeTab === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Files
                </h2>
              </div>

              <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                <FileUpload onChange={handleFileUpload} />
              </BackgroundGradient>

              <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Uploaded Files
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Filename
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Size
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Uploaded
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr
                          key={file.id}
                          className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {file.mimeType.startsWith("image/") ? (
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/20 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {file.originalName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {file.filename}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs">
                              {file.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {formatBytes(file.size)}
                          </td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                            {formatDate(file.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BackgroundGradient>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
