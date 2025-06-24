
import express from 'express'
import { createGuidance, getAllGuidance } from '../contoller/guidanceController.js';



 export const guidance = express.Router();
guidance.post('/guidance/register',createGuidance)
guidance.get('/guidance/all',getAllGuidance)