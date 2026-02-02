/**
 * ConversationOrchestrator Tests
 * Tests for the conversation orchestration logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ChatCompletion } from 'openai/resources/chat/completions';

// Mock the openai module
vi.mock('@/lib/ai/client', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
  ORCHESTRATION_MODEL: 'gpt-4o-mini',
  EXTRACTION_MODEL: 'gpt-4o-mini',
}));

// Import after mock - testing the exported functions and orchestrator
import { 
  ConversationOrchestrator, 
  getStepFlow, 
  getSectionTypeForStep,
  type ConversationContext 
} from '@/lib/chat/orchestrator';
import { openai } from '@/lib/ai/client';

const mockedCreate = vi.mocked(openai.chat.completions.create);

describe('ConversationOrchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create an orchestrator instance', () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'industry_selection',
        messages: [],
      };
      
      const orchestrator = new ConversationOrchestrator(context);
      expect(orchestrator).toBeDefined();
      expect(orchestrator).toBeInstanceOf(ConversationOrchestrator);
    });
  });

  describe('getStepFlow', () => {
    it('should return service industry steps by default', () => {
      const steps = getStepFlow();
      expect(steps).toContain('industry_selection');
      expect(steps).toContain('services');
      expect(steps).toContain('process');
      expect(steps).not.toContain('menu');
    });

    it('should return service industry steps for service type', () => {
      const steps = getStepFlow('service');
      expect(steps).toContain('services');
      expect(steps).toContain('process');
      expect(steps).toContain('portfolio');
    });

    it('should return local industry steps for local type', () => {
      const steps = getStepFlow('local');
      expect(steps).toContain('menu');
      expect(steps).toContain('location');
      expect(steps).toContain('gallery');
      expect(steps).not.toContain('services');
      expect(steps).not.toContain('process');
    });
  });

  describe('getSectionTypeForStep', () => {
    it('should return section type for valid section steps', () => {
      expect(getSectionTypeForStep('hero')).toBe('hero');
      expect(getSectionTypeForStep('services')).toBe('services');
      expect(getSectionTypeForStep('contact')).toBe('contact');
    });

    it('should return null for non-section steps', () => {
      expect(getSectionTypeForStep('industry_selection')).toBeNull();
      expect(getSectionTypeForStep('business_profile')).toBeNull();
      expect(getSectionTypeForStep('review')).toBeNull();
      expect(getSectionTypeForStep('complete')).toBeNull();
    });
  });

  describe('generateResponse', () => {
    it('should call AI to generate response', async () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'industry_selection',
        messages: [
          { id: 'msg-1', role: 'assistant', content: 'Hello! What type of business do you have?', timestamp: new Date().toISOString() }
        ],
      };

      mockedCreate.mockResolvedValueOnce({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4o-mini',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: 'Great! Tell me more about your consulting business.', refusal: null },
          logprobs: null,
          finish_reason: 'stop'
        }]
      } as ChatCompletion);

      const orchestrator = new ConversationOrchestrator(context);
      const result = await orchestrator.generateResponse();

      expect(result).toBe('Great! Tell me more about your consulting business.');
      expect(mockedCreate).toHaveBeenCalled();
    });
  });

  describe('getProgress', () => {
    it('should calculate progress for service industry', () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'services',
        industry: 'service',
        messages: [],
      };

      const orchestrator = new ConversationOrchestrator(context);
      const progress = orchestrator.getProgress();

      expect(progress.current).toBeGreaterThan(0);
      expect(progress.total).toBeGreaterThan(0);
      expect(progress.percentage).toBeGreaterThan(0);
      expect(progress.percentage).toBeLessThanOrEqual(100);
    });

    it('should calculate progress for local industry', () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'menu',
        industry: 'local',
        messages: [],
      };

      const orchestrator = new ConversationOrchestrator(context);
      const progress = orchestrator.getProgress();

      expect(progress.current).toBeGreaterThan(0);
      expect(progress.total).toBeGreaterThan(0);
    });
  });

  describe('getCompletedSections', () => {
    it('should return empty array at start', () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'industry_selection',
        messages: [],
      };

      const orchestrator = new ConversationOrchestrator(context);
      const completed = orchestrator.getCompletedSections();

      expect(completed).toEqual([]);
    });

    it('should return completed sections when past them', () => {
      const context: ConversationContext = {
        id: 'test-123',
        currentStep: 'about',
        industry: 'service',
        messages: [],
      };

      const orchestrator = new ConversationOrchestrator(context);
      const completed = orchestrator.getCompletedSections();

      expect(completed).toContain('hero');
      expect(completed).toContain('services');
      expect(completed).not.toContain('about');
    });
  });
});
