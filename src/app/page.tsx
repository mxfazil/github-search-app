"use client";
import { useState } from "react";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchUser() {
    setError(null);
    setUserData(null);

    if (!username.trim()) { 
      setError("Please enter a username");
      return;
    }

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);

      if (!res.ok) {
        throw new Error("User not found");
      }
      const data: GitHubUser = await res.json();
      setUserData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🔎 GitHub User Search</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mr-2 rounded"
      />
      <button
        onClick={fetchUser}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {userData && (
        <div className="mt-6 border p-4 rounded shadow-md max-w-sm">
          <img
            src={userData.avatar_url}
            alt="avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold">
            {userData.name || "No name available"}
          </h2>
          <p className="text-gray-600">@{userData.login}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Public Repos: {userData.public_repos}</p>
          <a
            href={userData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}