"use client";

import { createComment } from "@/app/utils/serverActions";
import { Button, Card, Column, Dialog, Feedback, Flex, Icon, Input, Line, Row, SmartLink, Switch, Text, Textarea, useToast } from "@/once-ui/components";
import { forwardRef, useState } from "react";
import FormComponent, { SubmitButton, type ActionToastResponse } from "./formActionClient";
import type { Comment } from "@wisp-cms/client";
import { formatDate } from "@/app/utils/formatDate";


interface CommentSectionProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    slug: string,
    comments: Comment[]
}


const CommentSection = forwardRef<HTMLDivElement, CommentSectionProps & { slug: string, comments: Comment[] }>(({ slug, comments }, ref) => {
    const rootComments = comments.filter(({ parent }) => !parent)
    return (<Column paddingTop="l" gap="m" fillWidth ref={ref}>
        <Text variant="heading-strong-l">Commentaires</Text>
        {rootComments.map((comment, i) => {
            return (<CommentBlock key={i} comment={comment} slug={slug} />)
        })}
        <AddComment slug={slug}>
            Ajouter un commentaire
        </AddComment>
    </Column >);
}
);


CommentSection.displayName = "CommentSection"

export default CommentSection

function CommentBlock({ comment }: { comment: Comment, slug: string }) {
    return <Row fillWidth key={comment.id}>
        <Card radius="l-4" direction="column" border="neutral-alpha-medium" fillWidth>
            <Column fillWidth paddingX="20" paddingY="24" gap="8">
                <Text variant="body-default-xl">{comment.author}</Text>
                <Text onBackground="neutral-weak" variant="body-default-s">
                    {comment.content}
                </Text>

                {
                    /*<AddComment slug={slug} commentId={comment.id} unStyled>
                    <Flex align="center" gap="4">
                        <Icon name="repondre" size="xs" onBackground="neutral-strong" />
                        Répondre à {comment.author}
                    </Flex>
                </AddComment>*/
                }

            </Column>
            <Line background="neutral-alpha-medium" />
            <Row
                paddingX="20" paddingY="12" gap="l" vertical="center"
                textVariant="label-default-s" onBackground="neutral-medium"
            >
                <Flex align="center" gap="4">
                    <Icon name="calendar" size="xs" onBackground="neutral-strong" />
                    {formatDate(comment.createdAt.toString())}
                </Flex>
                <Flex align="center" gap="4">
                    {comment.url && <><Icon name="globe" size="xs" onBackground="neutral-strong" marginLeft="24" />
                        <SmartLink href={comment.url} rel="nofollow">Visiter</SmartLink>
                    </>}
                </Flex>
            </Row>
        </Card>
    </Row>
}

interface AddCommentProps extends React.ComponentProps<typeof Column> {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    slug: string,
    commentId?: string,
    unStyled?: boolean
}
const AddComment = forwardRef<HTMLDivElement, AddCommentProps>(({ children, slug, commentId, unStyled }, ref) => {
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false)
    const { addToast } = useToast();

    async function handleSubmit(formData: FormData | void | null): Promise<ActionToastResponse | null | void> {
        if (!formData) {
            console.error("No form data provided");
            return null;
        }
        const res: ActionToastResponse = await createComment(formData)
        addToast(res);
        if (res.variant === "success") setIsOpen(false)
        return null
    }
    const validateEmail = (email: any) => {
        if (!email) return null;

        const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }

        return null;
    };

    return <Column ref={ref}>
        <Button type="button" size={"s"} onClick={() => setIsOpen(true)} variant={unStyled ? "tertiary" : "primary"}>
            {children}
        </Button>
        <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Ajouter un commentaire"
            aria-label="Ajouter un commentaire"
            footer={<Feedback
                variant="success"
                title="Information"
                description="Une fois votre commentaire envoyé, vous recevrez un courriel pour confirmer sa publication sur le site."
            />}
        >
            <FormComponent action={handleSubmit}>
                <Column fill gap="16">
                    <Row vertical="center" gap="16" mobileDirection="column">
                        <Input
                            id="author"
                            name="author"
                            label="Nom"
                            aria-label="Nom"
                            hasPrefix={
                                <Icon marginLeft="4" onBackground="neutral-weak" name="person" size="xs" />
                            }
                        />
                        <Input
                            id="email"
                            name="email"
                            label="Courriel"
                            aria-label="Courriel"
                            hasPrefix={
                                <Icon marginLeft="4" onBackground="neutral-weak" name="email" size="xs" />
                            }
                            validate={validateEmail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Row>
                    <Textarea
                        id="content"
                        name="content"
                        label="Message"
                        aria-label="Message"
                    />
                    <Row vertical="start" gap="16" mobileDirection="column">
                        <Input id="url"
                            name="url"
                            label="Votre site internet"
                            hasPrefix={
                                <Icon marginLeft="4" onBackground="neutral-weak" name="globe" size="xs" />
                            }
                        />
                        <Switch
                            id="allowEmailUsage"
                            name="allowEmailUsage"
                            label="Activer les notifications"
                            description="Recevoir une notification lorsqu’un nouveau commentaire est publié sur cette publication."
                            isChecked={isChecked}
                            onToggle={() => setIsChecked(!isChecked)}
                        />
                    </Row>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="allowEmailUsage" value={isChecked ? "true" : "false"} />
                    {commentId && <input type="hidden" name="parentId" value={commentId} />}
                    <Row fillWidth gap="16">
                        <SubmitButton variant="primary" size="m" aria-label="Envoyer le commentaire"
                        >
                            Commenter
                        </SubmitButton>
                        <Button variant="tertiary" onClick={() => setIsOpen(false)} aria-label="Annuler et fermer la fenêtre"
                        >
                            Annuler
                        </Button>
                    </Row>

                </Column>
            </FormComponent>
        </Dialog>
    </Column>

});

AddComment.displayName = "AddComment"

export { AddComment }