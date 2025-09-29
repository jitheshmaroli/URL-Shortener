import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const urlController = new UrlController();

router.post(
  '/shorten',
  authMiddleware,
  urlController.shortenUrl.bind(urlController)
);
router.get(
  '/myurls',
  authMiddleware,
  urlController.getMyUrls.bind(urlController)
);
router.get('/:shortCode', urlController.redirect.bind(urlController));

export default router;
