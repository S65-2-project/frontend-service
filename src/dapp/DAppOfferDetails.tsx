import React, {useEffect} from "react";
import {DAppOffer} from './types/DAppOffer';
import config from "../config.json";
import {useParams, withRouter} from "react-router";
import {Alert, Button, Form, ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {User} from "./types/CreateDAppOfferModel";
import {DAppOfferUser} from "../DAppListOverview/types/DAppOffer";
import CreateChat from "../types/CreateChat";

export const DAppOfferDetails = (props: any) => {

    const {id} = useParams();

    const [information, setInformation] = React.useState(<div/>)
    const [error, setError] = React.useState(<div/>)


    useEffect(() => {
        const getInformation = async (id: string): Promise<DAppOffer> => {
            let options: RequestInit = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                cache: "default"
            };
            let idRequest: string = "/" + id;
            let response: Response = await fetch(config.SERVICES.DAPP + idRequest, options);
            let body = await response.text();
            if (response.status === 200) {
                return JSON.parse(body); //returns type DAppOffer if backend is consistent.
            } else {
                throw new Error(body);
            }

        };

        const deleteOffer = async (id: string) => {
            if (id) {
                try {
                    await DeleteOffer(id)
                    props.history.push("/dappoffer")
                } catch (e) {
                    setError(<Alert variant={"danger"} onClick={() => setError(<div/>)}>{e.message}</Alert>)
                    return;
                }
            }
        }

        const DeleteOffer = async (id: string): Promise<boolean> => {
            let options: RequestInit = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                cache: "default"
            }
            let idRequest: string = "/" + id;
            let response: Response = await fetch(config.SERVICES.DAPP + idRequest, options);
            if (response.status === 200) {

                return true;
            } else {
                let text = await response.text();
                throw new Error(text);
            }
        };

        // Startchat button, starts a chat and redirects user to the chat window
        const initializeChat = async (provider: any) => {
            const {auth} = props;

            let chatInvoker: DAppOfferUser = {
                id: auth.User.id,
                name: auth.User.email
            };

            let chatReceiver: DAppOfferUser = {
                id: provider.id,
                name: provider.name
            }

            let createChat: CreateChat = {
                buyer: chatInvoker,
                seller: chatReceiver
            }

            let options: RequestInit = {
                method: "POST",
                body: JSON.stringify(createChat),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + props.auth.User.token
                },
                mode: "cors",
                cache: "default"
            };
            let response: Response = await fetch(config.SERVICES.COMMUNICATION_SERVICE, options);
            if (response.status === 200) {
                props.history.push('/chat')
            } else {
                let text = await response.text();
                Error(text)
            }
        }

        const loadHtml = async (id: string) => {
            try {
                let details: DAppOffer = await getInformation(id);
                let participantBlock = <>0</>
                if (details.delegatesCurrentlyInOffer.length !== 0) {
                    const participants = details.delegatesCurrentlyInOffer.map(
                        (delegate: User) =>
                            <ListGroup.Item>
                                <Link to={"/profile/" + delegate.id}>
                                    {delegate.Name}
                                </Link>
                            </ListGroup.Item>
                    );
                    participantBlock = <ListGroup>{participants}</ListGroup>;
                }
                setInformation(
                    <Form style={{marginTop: '20px'}}>
                        <h3><Form.Group>
                            <Form.Label>Offer made
                                by: <Link
                                    to={"/profile/" + details.provider.id}><strong>{details.provider.Name}</strong></Link>.</Form.Label>
                        </Form.Group>
                        </h3>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control readOnly={true} as="textarea" rows="3" value={details.description}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>You will need to be available is
                                for <strong>{details.offerLengthInMonths}</strong> months.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Reward will be <strong>{details.liskPerMonth}</strong> Lisk a
                                month.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Delegates need in this offer: <strong>{details.delegatesNeededForOffer}</strong>.</Form.Label>
                        </Form.Group>
                        {
                            details.delegatesCurrentlyInOffer.length !== 0
                                ? <Form.Group>
                                    <Form.Label>Delegates currently in offer:</Form.Label>
                                    <Form.Group>
                                        {participantBlock}
                                    </Form.Group>
                                </Form.Group>
                                : <Form.Group>
                                    <Form.Label>Delegates currently in offer: none</Form.Label>
                                </Form.Group>
                        }
                        <Form.Group>
                            <Form.Label>Date start: <strong>{details.dateStart}</strong></Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date end : <strong>{details.dateEnd}</strong> </Form.Label>
                        </Form.Group>
                        <Button variant="primary" style={{marginRight: '20px'}}
                                onClick={() => initializeChat(details.provider)}>Start de
                            chat!</Button>
                        <Button onClick={() => deleteOffer(id)}>Delete</Button>
                    </Form>
                )
            } catch (e) {
                setError(<Alert variant={"warning"} onClick={() => setError(<div/>)}>{e.message}</Alert>)
            }
        };
        if (id) {
            loadHtml(id)
        }


    }, [id, props.history]);

    return (
        <div>
            {error}
            {information}
        </div>
    )
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};

export default withRouter(connect(mapStateToProps)(DAppOfferDetails));