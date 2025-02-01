import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { useMemo, useState } from 'react'
import { Tag } from './App'
import { Note } from './App'
import styles from './NoteList.module.css'

type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    updateTag: (id: string, label: string) => void
    deleteTag: (id: string) => void
}

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

type EditTagsModalProps = {
    availableTags: Tag[]
    handleClose: () => void
    show: boolean
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
}

const NoteList = ({ availableTags, notes, updateTag, deleteTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState('')
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes])

    return (
        <div>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant='outline-secondary'
                            onClick={() => {setEditTagsModalIsOpen(true)}}
                        >Edit tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter title" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                isMulti
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
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal availableTags={availableTags} show={editTagsModalIsOpen} deleteTag={deleteTag} updateTag={updateTag} handleClose={() => {setEditTagsModalIsOpen(false)}}/>

        </div>
    )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`} >
            <Card.Body>
                <Stack gap={2} className='align-items-center justify-content-center h-100'>
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && (
                        <Stack direction="horizontal" gap={1} className='justify-content-center flex-wrap'>
                            {tags.map(tag => (
                                <Badge key={tag.id} className='text-truncate'>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

function EditTagsModal({availableTags, handleClose, show, deleteTag, updateTag} : EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control type="text" defaultValue={tag.label} onChange={(e) => {updateTag(tag.id, e.target.value)}}/>
                                </Col>
                                <Col xs="auto">
                                    <Button variant='outline-danger' onClick={() => {deleteTag(tag.id)}}>&times;</Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default NoteList