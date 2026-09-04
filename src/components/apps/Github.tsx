import { useState, useEffect } from "react";
import { useStore } from "~/stores";
import {
  MapPin,
  Link as LinkIcon,
  Users,
  BookOpen,
  Star,
  GitFork,
  ExternalLink,
  Building2,
  Twitter,
  User
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  company: string;
  twitter_username: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  fork: boolean;
  topics: string[];
}

const GITHUB_USERNAME = "sriramkidambi";
const GITHUB_PROFILE_REPO = "sriramkidambi";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#239120",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#fa7343",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00"
};

const Github = () => {
  const wifi = useStore((state) => state.wifi);
  const dark = useStore((state) => state.dark);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"repos" | "readme">("readme");
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  useEffect(() => {
    if (!wifi) return;

    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
          )
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        const userData = await userRes.json();
        const reposData = await reposRes.json();

        setUser(userData);
        setRepos(reposData.filter((repo: GitHubRepo) => !repo.fork));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchReadme = async () => {
      try {
        setReadmeLoading(true);
        setReadmeError(null);

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_PROFILE_REPO}/readme`,
          {
            headers: {
              Accept: "application/vnd.github+json"
            }
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setReadmeError("No README found in this repository");
            return;
          }
          throw new Error("Failed to fetch README");
        }

        const data = await response.json();

        if (data.encoding === "base64" && data.content) {
          // Remove newlines from base64 string before decoding
          const cleanBase64 = data.content.replace(/\n/g, "");
          // Properly decode UTF-8 content (handles emojis and special characters)
          const binaryString = atob(cleanBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const decodedContent = new TextDecoder("utf-8").decode(bytes);
          setReadme(decodedContent);
        }
      } catch (err) {
        setReadmeError(err instanceof Error ? err.message : "Failed to load README");
      } finally {
        setReadmeLoading(false);
      }
    };

    // Run both fetch operations in parallel for better performance
    Promise.all([fetchGitHubData(), fetchReadme()]);
  }, [wifi]);

  if (!wifi) {
    return (
      <div
        className={`w-full h-full flex-center ${dark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-600"}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">You Are Not Connected to the Internet</div>
          <div className="pt-4 text-sm">
            This page can't be displayed because your computer is currently offline.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`w-full h-full flex-center ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${dark ? "border-gray-400" : "border-gray-600"}`}
          />
          <span className={dark ? "text-gray-400" : "text-gray-600"}>
            Loading GitHub profile...
          </span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        className={`w-full h-full flex-center ${dark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-600"}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">Failed to Load Profile</div>
          <div className="pt-4 text-sm">{error || "Unknown error occurred"}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full overflow-hidden flex ${dark ? "bg-[#0d1117]" : "bg-[#f6f8fa]"}`}
    >
      {/* Sidebar - Profile */}
      <div
        className={`w-80 flex-shrink-0 p-6 overflow-y-auto border-r ${dark ? "border-gray-700 bg-[#010409]" : "border-gray-200 bg-white"}`}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-48 h-48 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-lg"
          />
          <h1
            className={`mt-4 text-2xl font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}
          >
            {user.name}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg ${dark ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"}`}
          >
            @{user.login}
          </a>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p
            className={`mt-4 text-sm text-center ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {user.bio}
          </p>
        ) : null}

        {/* View on GitHub button */}
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            dark
              ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          View on GitHub
        </a>

        {/* Stats */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-1">
            <Users className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>
              {user.followers}
            </span>
            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              followers
            </span>
          </div>
          <span className={dark ? "text-gray-600" : "text-gray-300"}>·</span>
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>
              {user.following}
            </span>
            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              following
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-2">
          {user.company ? (
            <div className="flex items-center gap-2">
              <Building2
                className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
              />
              <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                {user.company}
              </span>
            </div>
          ) : null}
          {user.location ? (
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                {user.location}
              </span>
            </div>
          ) : null}
          {user.blog ? (
            <div className="flex items-center gap-2">
              <LinkIcon
                className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
              />
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${dark ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"}`}
              >
                {user.blog}
              </a>
            </div>
          ) : null}
          {user.twitter_username ? (
            <div className="flex items-center gap-2">
              <Twitter
                className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
              />
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${dark ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"}`}
              >
                @{user.twitter_username}
              </a>
            </div>
          ) : null}
        </div>

        {/* Repo count */}
        <div
          className={`mt-6 pt-6 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
              <span
                className={`font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
              >
                {user.public_repos}
              </span>{" "}
              public repositories
            </span>
          </div>
        </div>
      </div>

      {/* Main content - Repos */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div
          className={`flex gap-4 px-6 pt-4 border-b ${dark ? "border-gray-700" : "border-gray-200"}`}
        >
          <button
            onClick={() => setActiveTab("readme")}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "readme"
                ? dark
                  ? "border-orange-500 text-gray-100"
                  : "border-orange-500 text-gray-900"
                : dark
                  ? "border-transparent text-gray-400 hover:text-gray-200"
                  : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </div>
          </button>
          <button
            onClick={() => setActiveTab("repos")}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "repos"
                ? dark
                  ? "border-orange-500 text-gray-100"
                  : "border-orange-500 text-gray-900"
                : dark
                  ? "border-transparent text-gray-400 hover:text-gray-200"
                  : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Repositories
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${dark ? "bg-gray-700" : "bg-gray-200"}`}
              >
                {repos.length}
              </span>
            </div>
          </button>
        </div>

        {/* Repo list */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "readme" ? (
            readmeLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${dark ? "border-gray-400" : "border-gray-600"}`}
                  />
                  <span className={dark ? "text-gray-400" : "text-gray-600"}>
                    Loading README...
                  </span>
                </div>
              </div>
            ) : readmeError ? (
              <div
                className={`p-6 rounded-lg border ${dark ? "border-red-900 bg-red-900/10 text-red-300" : "border-red-200 bg-red-50 text-red-600"}`}
              >
                <p className="text-sm">{readmeError}</p>
              </div>
            ) : readme ? (
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1({ children }) {
                      return (
                        <h1
                          className={`text-2xl font-bold mb-4 pb-2 border-b ${
                            dark
                              ? "text-gray-100 border-gray-700"
                              : "text-gray-900 border-gray-200"
                          }`}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2({ children }) {
                      return (
                        <h2
                          className={`text-xl font-bold mt-6 mb-3 ${
                            dark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3({ children }) {
                      return (
                        <h3
                          className={`text-lg font-bold mt-5 mb-2 ${
                            dark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {children}
                        </h3>
                      );
                    },
                    p({ children }) {
                      return (
                        <p
                          className={`text-base mb-4 leading-relaxed ${
                            dark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </p>
                      );
                    },
                    ul({ children }) {
                      return (
                        <ul
                          className={`list-disc list-inside mb-4 ml-4 space-y-2 ${
                            dark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </ul>
                      );
                    },
                    ol({ children }) {
                      return (
                        <ol
                          className={`list-decimal list-inside mb-4 ml-4 space-y-2 ${
                            dark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </ol>
                      );
                    },
                    li({ children }) {
                      return <li className="leading-relaxed">{children}</li>;
                    },
                    code({ node, inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="my-4">
                          <SyntaxHighlighter
                            style={dark ? (oneDark as any) : (oneLight as any)}
                            language={match[1]}
                            PreTag="div"
                            className="!bg-transparent !p-4 !m-0 rounded-lg"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code
                          className={`px-1.5 py-0.5 rounded text-xs ${
                            dark
                              ? "bg-gray-800 text-blue-300"
                              : "bg-gray-100 text-blue-600"
                          }`}
                        >
                          {children}
                        </code>
                      );
                    },
                    a({ children, href }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-blue-500 hover:text-blue-400 hover:underline`}
                        >
                          {children}
                        </a>
                      );
                    },
                    img({ src, alt, width, height, ...props }) {
                      // Check if this is an inline icon (has explicit small dimensions)
                      const hasSmallDimensions =
                        (width && Number(width) <= 60) ||
                        (height && Number(height) <= 60);

                      return (
                        <img
                          src={src}
                          alt={alt}
                          width={width}
                          height={height}
                          className={
                            hasSmallDimensions
                              ? "inline-block align-middle mx-1"
                              : "max-w-full h-auto rounded-lg my-4"
                          }
                          style={hasSmallDimensions ? { width, height } : undefined}
                          {...props}
                        />
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote
                          className={`my-4 pl-4 py-2 border-l-4 ${
                            dark
                              ? "border-gray-600 bg-gray-800/30 text-gray-300"
                              : "border-gray-300 bg-gray-100 text-gray-700"
                          }`}
                        >
                          {children}
                        </blockquote>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="my-4 overflow-x-auto">
                          <table
                            className={`min-w-full border-collapse ${
                              dark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return (
                        <thead
                          className={`border-b-2 ${
                            dark
                              ? "border-gray-700 bg-gray-800/30"
                              : "border-gray-200 bg-gray-100"
                          }`}
                        >
                          {children}
                        </thead>
                      );
                    },
                    tbody({ children }) {
                      return <tbody>{children}</tbody>;
                    },
                    tr({ children }) {
                      return (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          {children}
                        </tr>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="px-4 py-2 text-left font-semibold">{children}</th>
                      );
                    },
                    td({ children }) {
                      return <td className="px-4 py-2">{children}</td>;
                    },
                    hr() {
                      return (
                        <hr
                          className={`my-6 border-0 ${
                            dark
                              ? "border-t-2 border-gray-700"
                              : "border-t-2 border-gray-200"
                          }`}
                        />
                      );
                    }
                  }}
                >
                  {readme}
                </ReactMarkdown>
              </div>
            ) : null
          ) : (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    dark
                      ? "border-gray-700 bg-[#161b22] hover:border-gray-600"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-lg font-semibold hover:underline ${dark ? "text-blue-400" : "text-blue-600"}`}
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p
                          className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {repo.description}
                        </p>
                      )}
                      {/* Topics */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {repo.topics.slice(0, 5).map((topic) => (
                            <span
                              key={topic}
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                dark
                                  ? "bg-blue-900/50 text-blue-300"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Stats */}
                      <div className="mt-3 flex items-center gap-4 text-xs">
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  languageColors[repo.language] || "#8b8b8b"
                              }}
                            />
                            <span className={dark ? "text-gray-300" : "text-gray-600"}>
                              {repo.language}
                            </span>
                          </div>
                        )}
                        {repo.stargazers_count > 0 && (
                          <div
                            className={`flex items-center gap-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                        )}
                        {repo.forks_count > 0 && (
                          <div
                            className={`flex items-center gap-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forks_count}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Github;
