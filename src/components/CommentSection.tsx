"use client";

import { createComment, getComments } from "@/app/utils/serverActions";
import { Card, Column, Icon, Input, Line, Row, Switch, Text, Textarea, useToast } from "@/once-ui/components";
import { useEffect, useState } from "react";
import FormComponent, { ActionToastResponse, SubmitButton } from "./formActionClient";
import { Comment } from "@wisp-cms/client";


export default function CommentSection({ slug, comments }: { slug: string, comments: Comment[] }) {
    const [isChecked, setIsChecked] = useState(false);
    const { addToast } = useToast();

    console.log(comments)
    async function handleSubmit(formData: FormData | void | null): Promise<ActionToastResponse | null | void> {
        console.log("Form submitted");
        if (!formData) {
            console.error("No form data provided");
            return null;
        }
        const res: ActionToastResponse = await createComment(formData)
        addToast(res);
        return null
    }
    return (
        <Column paddingTop="l" gap="m" fillWidth>
            <Text variant="heading-strong-l">Commentaires</Text>
            {comments.map((comment) => (
                <Row fillWidth key={comment.id}>
                    <Card radius="l-4" direction="column" border="neutral-alpha-medium" fillWidth>
                        <Column fillWidth paddingX="20" paddingY="24" gap="8">
                            <Text variant="body-default-xl">{comment.author}</Text>
                            <Text onBackground="neutral-weak" variant="body-default-s">
                                {comment.content}
                            </Text>
                        </Column>
                        <Line background="neutral-alpha-medium" />
                        <Row
                            paddingX="20" paddingY="12" gap="8" vertical="center"
                            textVariant="label-default-s" onBackground="neutral-medium"
                        >
                            <Icon name="like" size="s" onBackground="neutral-strong" />
                            34
                            <Icon name="chat" size="s" onBackground="neutral-strong" marginLeft="24" />
                            5
                        </Row>
                    </Card>
                </Row>
            ))}
            <FormComponent action={handleSubmit}>
                <Column fill gap="16">
                    <Row vertical="center" gap="16">
                        <Input
                            id="author"
                            name="author"
                            label="Nom"
                            hasPrefix={
                                <Icon marginLeft="4" onBackground="neutral-weak" name="email" size="xs" />
                            }
                        />
                        <Input
                            id="email"
                            name="email"
                            label="Courriel"
                            hasPrefix={
                                <Icon marginLeft="4" onBackground="neutral-weak" name="email" size="xs" />
                            }
                        />
                    </Row>
                    <Textarea
                        id="content"
                        name="content"
                        label="Message"
                        hasPrefix={
                            <Icon marginLeft="4" onBackground="neutral-weak" name="email" size="xs" />
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
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="allowEmailUsage" value={isChecked ? "true" : "false"} />
                    <SubmitButton variant="primary" size="m">
                        Publier
                    </SubmitButton>
                </Column>
            </FormComponent>
        </Column>
    );
}
