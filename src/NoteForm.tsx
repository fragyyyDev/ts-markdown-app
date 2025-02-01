import { Form, Stack, Row, Col } from "react-bootstrap"
import CreatableSelect from "react-select/creatable"
import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import { NoteData, Tag } from "./App"
import { v4 as uuidV4 } from "uuid"


type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>


const NoteForm = ({ onSubmit, onAddTag, availableTags, title = "", markdown="", tags = [] }: NoteFormProps) => {
    const navigate = useNavigate()
    const titleRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value,
            markdown: textareaRef.current!.value,
            tags: selectedTags
        })
        navigate("..")
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} type="text" required defaultValue={title}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableSelect
                                isMulti
                                onCreateOption={label => {
                                    const newTag: Tag = {
                                        id: uuidV4(),
                                        label
                                    };
                                    onAddTag(newTag);
                                    setSelectedTags(prev => [...prev, newTag]);
                                }}
                                value={selectedTags.map(tag => ({
                                    label: tag.label,
                                    value: tag.id
                                }))}
                                onChange={tags => {
                                    // `tags` can be `null` if the selection is cleared
                                    if (tags) {
                                        setSelectedTags(tags.map(tag => ({
                                            id: tag.value,
                                            label: tag.label
                                        })));
                                    } else {
                                        setSelectedTags([]);
                                    }
                                }}
                                options={availableTags.map(tag => {
                                    return {
                                        label: tag.label,
                                        value: tag.id
                                    }
                                })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Col>
                    <Form.Group controlId="markdown">
                        <Form.Label>Body</Form.Label>
                        <Form.Control ref={textareaRef} type="text" required as="textarea" rows={15} defaultValue={markdown}/>
                    </Form.Group>
                </Col>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="primary">Save</Button>
                    <Link to={".."}>
                        <Button type="button" variant="outline-secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}

export default NoteForm