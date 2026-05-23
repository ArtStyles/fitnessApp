import { Request, Response } from 'express'
import * as gamificationService from './gamification.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'

export async function getUserGamification(req: AuthRequest, res: Response) {
  const data = await gamificationService.getUserGamification(req.user!.id)
  sendSuccess(res, data)
}

export async function listBadges(req: AuthRequest, res: Response) {
  const badges = await gamificationService.listBadges(req.user!.id)
  sendSuccess(res, badges)
}

export async function listActiveChallenges(req: AuthRequest, res: Response) {
  const challenges = await gamificationService.listActiveChallenges(req.user!.id)
  sendSuccess(res, challenges)
}

export async function joinChallenge(req: AuthRequest, res: Response) {
  const participant = await gamificationService.joinChallenge(req.user!.id, req.params.id)
  sendSuccess(res, participant, 201)
}

export async function getLeaderboard(_req: Request, res: Response) {
  const leaderboard = await gamificationService.getLeaderboard()
  sendSuccess(res, leaderboard)
}

export async function createBadge(req: AuthRequest, res: Response) {
  const badge = await gamificationService.createBadge(req.body)
  sendSuccess(res, badge, 201)
}

export async function createChallenge(req: AuthRequest, res: Response) {
  const challenge = await gamificationService.createChallenge(req.body)
  sendSuccess(res, challenge, 201)
}

export async function updateChallenge(req: AuthRequest, res: Response) {
  const challenge = await gamificationService.updateChallenge(req.params.id, req.body)
  sendSuccess(res, challenge)
}
