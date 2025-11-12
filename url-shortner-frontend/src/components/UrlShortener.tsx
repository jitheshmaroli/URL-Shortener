import React, { useState, useEffect, useCallback } from "react";
import { shortenUrl, getMyUrls, logout, deleteUrl } from "../services/api";
import { RiLogoutCircleRLine, RiCloseLine } from "react-icons/ri";
import styles from "../styles/UrlShortener.module.css";
import type { Url } from "../types/urlTypes";
import { ROUTES } from "../constants";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { IoInformationCircleOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Url | null>(null);
  const [limit] = useState(5);
  const navigate = useNavigate();

  const fetchUrls = useCallback(
    async (page: number) => {
      const res = await getMyUrls(page, limit);
      if (res.success && res.urls && res.pagination) {
        setUrls(res.urls);
        setTotalPages(res.pagination.totalPages);
      } else {
        setMessage(res.message ?? "Failed to fetch URLs");
        setMessageType('error');
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchUrls(currentPage);
  }, [currentPage, fetchUrls]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    const res = await shortenUrl(originalUrl);
    if (res.success && res.shortUrl) {
      setShortUrl(res.shortUrl);
      if (res.message) {
        setMessage(res.message);
      } else {
        setMessage("URL shortened successfully!");
      }
      setMessageType('success');
      setCurrentPage(1);
      fetchUrls(1);
    } else {
      setMessage(res.message ?? "Failed to shorten URL");
      setMessageType('error');
    }
  };

  const handleReset = () => {
    setOriginalUrl("");
    setShortUrl("");
    setMessage("");
    setMessageType('');
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate(ROUTES.LOGIN);
    } else {
      console.error("Logout failed:", res.message);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenDetails = (url: Url) => {
    setSelectedUrl(url);
    setIsModalOpen(true);
  };

  const handleOpenConfirm = (url: Url) => {
    setUrlToDelete(url);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!urlToDelete) return;
    setMessage('');
    setMessageType('');
    const res = await deleteUrl(urlToDelete._id);
    if (res.success) {
      setMessage("URL deleted successfully");
      setMessageType('success');
      fetchUrls(currentPage);
    } else {
      setMessage(res.message ?? "Failed to delete URL");
      setMessageType('error');
    }
    setIsConfirmOpen(false);
    setUrlToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUrl(null);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setUrlToDelete(null);
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
            {(originalUrl || shortUrl) && (
              <button
                type="button"
                onClick={handleReset}
                className={styles.resetButton}
                aria-label="Reset"
                title="Clear fields">
                <RiCloseLine size={20} />
              </button>
            )}
          </form>
          {shortUrl && (
            <p className={styles.shortUrl}>
              Short URL:{" "}
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
          )}
          {message && (
            <p
              className={
                messageType === 'error' ? styles.error : styles.success
              }>
              {message}
            </p>
          )}
        </section>
        <section className={styles.card}>
          <h2>My URLs</h2>
          <div className={styles.urlList}>
            <table>
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Shortened URL</th>
                  <th>Actions</th>
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
                    <td className={styles.actions}>
                      <IoInformationCircleOutline
                        onClick={() => handleOpenDetails(url)}
                        className={`${styles.actionIcon} ${styles.infoIcon}`}
                        size={20}
                        title="View details"
                      />
                      <RiDeleteBin6Line
                        onClick={() => handleOpenConfirm(url)}
                        className={`${styles.actionIcon} ${styles.deleteIcon}`}
                        size={20}
                        title="Delete"
                      />
                    </td>
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="URL Details">
        {selectedUrl && (
          <div>
            <p><strong>Short URL:</strong> <a href={selectedUrl.shortUrl} target="_blank" rel="noopener noreferrer">{selectedUrl.shortUrl}</a></p>
            <p><strong>Click Count:</strong> {selectedUrl.clickCount}</p>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        title="Confirm Delete">
        {urlToDelete && (
          <div>
            <p>Are you sure you want to delete this URL?</p>
            <p className={styles.confirmUrl}><small>{urlToDelete.originalUrl}</small></p>
            <div className={styles.confirmButtons}>
              <button
                onClick={handleConfirmDelete}
                className={styles.dangerButton}
              >
                Delete
              </button>
              <button
                onClick={handleCloseConfirm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UrlShortener;