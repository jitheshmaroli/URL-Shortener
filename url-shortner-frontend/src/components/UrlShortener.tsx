import React, { useState, useEffect, useCallback } from "react";
import { shortenUrl, getMyUrls, logout } from "../services/api";
import { RiLogoutCircleRLine } from "react-icons/ri";
import styles from "../styles/UrlShortener.module.css";
import type { Url } from "../types/urlTypes";
import { ROUTES } from "../constants";

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchUrls = useCallback(
    async (page: number) => {
      const res = await getMyUrls(page, limit);
      if (res.success && res.urls && res.pagination) {
        setUrls(res.urls);
        setTotalPages(res.pagination.totalPages);
      } else {
        setMessage(res.message ?? "Failed to fetch URLs");
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchUrls(currentPage);
  }, [currentPage, fetchUrls]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await shortenUrl(originalUrl);
    if (res.success && res.shortUrl) {
      setShortUrl(res.shortUrl);
      setCurrentPage(1);
      fetchUrls(1);
    } else {
      setMessage(res.message ?? "Failed to shorten URL");
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = ROUTES.LOGIN;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>URL Shortener Dashboard</h1>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          aria-label="Logout"
          title="Logout">
          <RiLogoutCircleRLine size={24} />
        </button>
      </header>
      <main className={styles.content}>
        <section className={styles.card}>
          <h2>Shorten a URL</h2>
          <form onSubmit={handleShorten} className={styles.form}>
            <input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value ?? "")}
              placeholder="Enter URL"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Shorten
            </button>
          </form>
          {shortUrl && (
            <p className={styles.shortUrl}>
              Short URL:{" "}
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
          )}
          <p
            className={
              message.includes("failed") ? styles.error : styles.success
            }>
            {message}
          </p>
        </section>
        <section className={styles.card}>
          <h2>My URLs</h2>
          <div className={styles.urlList}>
            <table>
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Shortened URL</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        {url.originalUrl.length > 50
                          ? `${url.originalUrl.substring(0, 50)}...`
                          : url.originalUrl}
                      </a>
                    </td>
                    <td>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        {url.shortUrl}
                      </a>
                    </td>
                    <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {urls.length === 0 && <p>No URLs found.</p>}
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
                aria-label="Previous page">
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
                aria-label="Next page">
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UrlShortener;
