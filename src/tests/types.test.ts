import { describe, it, expect } from 'vitest'
import type { PostType } from '@/modules/blog/models/types'
import type { AvisType } from '@/shared/components/AvisClients'

describe('PostType', () => {
  it('should have correct structure for a valid post', () => {
    const post: PostType = {
      slug: 'test-post',
      metadata: {
        title: 'Test Post',
        description: 'A test post description',
        publishedAt: '2024-01-01',
        updatedAt: null,
        summary: 'A test post description',
        image: '/images/test.webp',
        team: [],
      },
      content: 'Test content',
    }

    expect(post.slug).toBe('test-post')
    expect(post.metadata.title).toBe('Test Post')
    expect(post.metadata.description).toBe('A test post description')
    expect(post.metadata.publishedAt).toBe('2024-01-01')
    expect(post.metadata.image).toBe('/images/test.webp')
    expect(post.content).toBe('Test content')
  })

  it('should allow optional fields', () => {
    const post: PostType = {
      slug: 'minimal-post',
      metadata: {
        title: 'Minimal',
        description: 'Minimal post',
        publishedAt: null,
        updatedAt: null,
        summary: 'Minimal post',
        image: null,
        team: [],
      },
    }

    expect(post.slug).toBe('minimal-post')
    expect(post.metadata.team).toEqual([])
  })
})

describe('AvisType', () => {
  it('should have correct structure for a valid Google review', () => {
    const avis: AvisType = {
      author_name: 'John Doe',
      author_url: 'https://maps.google.com/john',
      language: 'fr-FR',
      original_language: 'fr',
      profile_photo_url: 'https://example.com/photo.jpg',
      rating: 5,
      relative_time_description: 'il y a 2 jours',
      text: 'Excellent service!',
      time: 1704067200,
      translated: 'fr',
    }

    expect(avis.author_name).toBe('John Doe')
    expect(avis.rating).toBe(5)
    expect(avis.text).toBe('Excellent service!')
    expect(avis.time).toBe(1704067200)
  })

  it('should allow rating of 1', () => {
    const avis: AvisType = {
      author_name: 'Jane Doe',
      author_url: 'https://maps.google.com/jane',
      language: 'fr-FR',
      original_language: 'en',
      profile_photo_url: 'https://example.com/photo2.jpg',
      rating: 1,
      relative_time_description: 'il y a 1 semaine',
      text: 'Could be better',
      time: 1704067200,
      translated: 'en',
    }

    expect(avis.rating).toBe(1)
  })
})
