"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Accordion, Avatar, Badge, Button, Card, Column, Flex, Grid, Icon, Input, Row, Tag, Text } from "@once-ui-system/core"

interface GitHubRepo {
    id: number
    name: string
    full_name: string
    description: string | null
    html_url: string
    clone_url: string
    language: string | null
    stargazers_count: number
    watchers_count: number
    forks_count: number
    open_issues_count: number
    created_at: string
    updated_at: string
    pushed_at: string
    size: number
    default_branch: string
    topics: string[]
    license: {
        name: string
        spdx_id: string
    } | null
    owner: {
        login: string
        avatar_url: string
        html_url: string
        type: string
    }
    private: boolean
    archived: boolean
    disabled: boolean
}

export default function GitHubRepoSummary({ ownerProvided, repoProvided }: { ownerProvided?: string, repoProvided?: string }) {
    const [repoData, setRepoData] = useState<GitHubRepo | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [owner, setOwner] = useState(ownerProvided)
    const [repo, setRepo] = useState(repoProvided)

    const fetchRepoData = async () => {
        if (!owner || !repo) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/github/${owner}/${repo}`)

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            setRepoData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue")
            setRepoData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRepoData()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatSize = (sizeInKB: number) => {
        if (sizeInKB < 1024) return `${sizeInKB} KB`
        const sizeInMB = sizeInKB / 1024
        if (sizeInMB < 1024) return `${sizeInMB.toFixed(1)} MB`
        const sizeInGB = sizeInMB / 1024
        return `${sizeInGB.toFixed(1)} GB`
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        fetchRepoData()
    }

    return (
        <Column fillWidth padding="m" marginTop="m" marginBottom="m" gap="s" radius="m" maxWidth={40} border="neutral-alpha-weak">
            {/* Formulaire de recherche */}
            {!(ownerProvided && repoProvided) && <>
                <Column gap="s">
                    <Text variant="display-strong-s">Résumé de Dépôt GitHub</Text>
                    <Text variant="label-default-s">Entrez le propriétaire et le nom du dépôt pour afficher ses informations</Text>
                </Column>
                <Column>
                    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                        <Column gap="s">
                            <Row gap="s">
                                <Input label="Propriétaire" id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ex: vercel" />
                                <Input label="Dépôt" id="repo" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="ex: next.js" />
                            </Row>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
                            </Button>
                        </Column>
                    </form>
                </Column>
            </>
            }

            {/* Affichage des erreurs */}
            {error && (
                    <Row paddingTop="m" center gap="s" fillWidth>
                        <Icon name="danger" onBackground="danger-medium" />
                        <Text onBackground="danger-medium">{error}</Text>
                    </Row>
            )}

            {/* Affichage des données du dépôt */}
            {repoData && (<>
                <Row gap="xs" fillWidth horizontal="between" s={{ direction: "column" }}>
                    <Row gap="xs" center>
                        <Avatar size={"l"} src={repoData.owner.avatar_url || "/placeholder.svg"} />
                        <Column>
                            <Text variant="label-strong-m">{repoData.full_name}</Text>
                            <Row gap="s" align="start">
                                {repoData.private && <Badge >Privé</Badge>}
                                {repoData.archived && <Badge >Archivé</Badge>}
                                {repoData.disabled && <Badge >Désactivé</Badge>}
                            </Row>
                            <Text variant="label-default-s">
                                {repoData.description || "Aucune description disponible"}
                            </Text>
                        </Column>
                    </Row>
                    <Row gap="s" center>
                        <Row gap="xs" center>
                            <Icon name="users" />
                            {repoData.owner.type}
                        </Row>
                        <Button size="s"  variant="tertiary" href={repoData.html_url} target="_blank" rel="noopener noreferrer" prefixIcon={"linkblank"}>
                            Voir sur GitHub
                        </Button>
                    </Row>
                </Row>
                <Card radius="m" padding="m" background="surface" fillWidth>
                    <Grid columns="4" s={{ columns: 2 }} gap="m" fillWidth>
                        <Column center>
                            <Row gap="xs" center>
                                <Icon name="star" style={{ color: "#FECC55" }} size="xl" />
                                <Column>
                                    <Text variant="body-strong-xl">{repoData.stargazers_count.toLocaleString()}</Text>
                                    <Text onBackground="neutral-weak">Étoiles</Text>
                                </Column>
                            </Row>
                        </Column>
                        <Column center>
                            <Row gap="xs" center>
                                <Icon name="gitfork" size="xl" onBackground="neutral-weak" />
                                <Column>
                                    <Text variant="body-strong-xl">{repoData.forks_count.toLocaleString()}</Text>
                                    <Text onBackground="neutral-weak">Forks</Text>
                                </Column>
                            </Row>
                        </Column>
                        <Column center>
                            <Row gap="xs" center>
                                <Icon name="eye" size="xl" onBackground="neutral-weak" />
                                <Column>
                                    <Text variant="body-strong-xl">{repoData.watchers_count.toLocaleString()}</Text>
                                    <Text onBackground="neutral-weak">Watchers</Text>
                                </Column>
                            </Row>
                        </Column>
                        <Column center>
                            <Row gap="xs" center>
                                <Icon name="danger" size="xl" onBackground="neutral-weak" />
                                <Column>
                                    <Text variant="body-strong-xl">{repoData.open_issues_count.toLocaleString()}</Text>
                                    <Text onBackground="neutral-weak">Issues</Text>
                                </Column>
                            </Row>
                        </Column>
                    </Grid>
                </Card>
                {/* Détails techniques */}
                <Accordion title="Détails">
                    <Column gap="m" fillWidth>
                        <Grid columns="2" s={{ columns: 1 }} gap="m" fillWidth>
                            <Column gap="s">
                                <Column vertical="center" >
                                    <Text variant="label-strong-s" onBackground="brand-weak">Langage principal:</Text>
                                    <Tag variant="success" prefixIcon="code" size="s">{repoData.language || "Non spécifié"}</Tag>
                                </Column>
                                <Column>
                                    <Text variant="label-strong-s" onBackground="brand-weak">Taille:</Text>
                                    <Text>{formatSize(repoData.size)}</Text>
                                </Column>
                                <Column>
                                    <Text variant="label-strong-s" onBackground="brand-weak">Branche par défaut:</Text>
                                    <>{repoData.default_branch}</>
                                </Column>
                                {repoData.license && (
                                    <Column>
                                        <Text variant="label-strong-s" onBackground="brand-weak">Licence:</Text>
                                        <>{repoData.license.name}</>
                                    </Column>
                                )}
                            </Column>

                            <Column gap="s">
                                <Column align="start">
                                    <Text variant="label-strong-s" onBackground="brand-weak">Créé le:</Text>
                                    <>{formatDate(repoData.created_at)}</>
                                </Column>
                                <Column align="start">
                                    <Text variant="label-strong-s" onBackground="brand-weak">Dernière mise à jour:</Text>
                                    <>{formatDate(repoData.updated_at)}</>
                                </Column>
                                <Column align="start">
                                    <Text variant="label-strong-s" onBackground="brand-weak">Dernier push:</Text>
                                    <>{formatDate(repoData.pushed_at)}</>
                                </Column>
                            </Column>
                        </Grid>

                        {repoData.topics.length > 0 && (
                            <>
                                <Flex gap="2" wrap>
                                    <Text variant="body-strong-l" onBackground="accent-strong" paddingRight="s">Sujets:</Text>
                                    {repoData.topics.map((topic) => (
                                        <Tag key={topic} size="s" variant="info">
                                            {topic}
                                        </Tag>
                                    ))}
                                </Flex>
                            </>
                        )}
                    </Column>
                </Accordion>
            </>
            )}
        </Column>
    )
}
