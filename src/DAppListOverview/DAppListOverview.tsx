import React, {useEffect} from "react";
import {DAppOffer, PaginationHeader, RequestDAppOfferOptions} from "./types/DAppOffer";
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Button from "react-bootstrap/Button";
import './DAppListOverview.css'
import ListGroup from "react-bootstrap/ListGroup";
import {Link} from "react-router-dom";
import config from '../config.json';
import Pagination from "react-bootstrap/Pagination";
import {Form} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

const DAppListOverview = () => {

    // HTML Objects
    const [dappCards, setDappCards] = React.useState(<></>);
    const [pagination, setPagination] = React.useState(<></>);

    // Validation error
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Filtering fields
    const [searchQ, setSearchQ] = React.useState<string>('');
    const [regionQ, setRegionQ] = React.useState<string>('');
    const [maxReward, setMaxReward] = React.useState<number | undefined>(undefined);
    const [minReward, setMinReward] = React.useState<number | undefined>(undefined);

    // API Response headers
    const [headers, setHeaders] = React.useState<PaginationHeader>({
        CurrentPage: 1,
        HasNext: undefined,
        HasPrevious: undefined,
        PageSize: undefined,
        TotalPages: 1,
        TotalCount: undefined
    });

    // Standard API GET Parameters
    const [requestDAppOfferOptions, setRequestDAppOfferOptions] = React.useState<RequestDAppOfferOptions>({
        MaxReward: undefined,
        MinReward: undefined,
        PageNumber: 1,
        PageSize: 9,
        RegionQuery: "",
        SearchQuery: ""
    });

    // useEffect is only being used on page load. Here it loads the first page of the api call with no filters applied.
    useEffect(() => {
        handleLoadDelegates();
        // eslint-disable-next-line
    }, []);

    // Single function to handle the API call with the data and headers.
    function handleLoadDelegates() {
        setDappCards(<div className="col-lg-4 d-flex align-items-stretch" style={{marginTop: '30px'}}><Spinner animation="border" variant="primary"/></div>);

        loadDelegates(requestDAppOfferOptions).then(r => {
            mapJsonToTSX(r.data);
            let customHeaders = r.headers;
            setHeaders(customHeaders);
            mapPagesToTSX(customHeaders);
        }).catch((error) => {
            setErrorMessage(error.message)
            setShowError(true)
        });
    }

    // The actual URL Builder and API Call.
    const loadDelegates = async (reqOptions: RequestDAppOfferOptions) => {
        // Request headers and other parameters
        const requestOptions: any = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: "cors",
            cache: "default",
        };

        // Bare minimum URL
        let url = `${config.SERVICES.DAPP}?PageNumber=${reqOptions?.PageNumber.toString()}&PageSize=${reqOptions?.PageSize}`

        // Additional components based on if they are populated or not
        if (reqOptions.MaxReward) url += `&MaxReward=${reqOptions.MaxReward}`
        if (reqOptions.MinReward) url += `&MinReward=${reqOptions.MinReward}`
        if (reqOptions.SearchQuery !== "") url += `&searchQuery=${reqOptions.SearchQuery}`
        if (reqOptions.RegionQuery !== "") url += `&regionQuery=${reqOptions.RegionQuery}`

        // The API Call

        let response = await fetch(url, requestOptions)
        let data = await response.json();

        if (response.status !== 200) {
            throw new Error(JSON.stringify(data))
        }

        return {headers: JSON.parse(response["headers"].get('X-Pagination') as string), data}
    }

    // The mapping of delegate objects from the json to HTML code
    const mapJsonToTSX = (json: DAppOffer[]) => {
        let mappedItems = json.map((item, key) => {
            return <div className="col-lg-4 d-flex align-items-stretch" style={{marginTop: '30px'}} key={item.id}>
                <Card className="card-styling card-hover" border="secondary" bg="light" style={{width: '100%'}}>
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Made by <i><Link
                            to={{pathname: "/profile/" + item.provider.id}}>{item.provider.name}</Link></i></Card.Subtitle>
                    </Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item variant="secondary">Region:
                            <b> {item.region}</b>
                        </ListGroup.Item>
                        <ListGroup.Item variant="secondary">Offer length:
                            <b> {item.offerLengthInMonths}</b> months
                        </ListGroup.Item>
                        <ListGroup.Item variant="secondary">Start of offer:
                            <b> {new Date(item.dateStart).toLocaleDateString()}</b>
                        </ListGroup.Item>
                        <ListGroup.Item variant="secondary">End of offer:
                            <b> {new Date(item.dateEnd).toLocaleDateString()}</b>
                        </ListGroup.Item>
                        <ListGroup.Item variant="primary">Reward: <b>{item.liskPerMonth}</b> Lisk per month
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Footer style={{height: '100px'}}>
                        <Link className="btn btn-primary" to={{pathname: "/dappoffer/" + item.id}}>Show more
                            details</Link>
                    </Card.Footer>

                </Card>
            </div>
        })

        setDappCards(<>{mappedItems}</>)
    }

    // Mapping of headers to pagination links. This is only for the numbers in between. The outside buttons can be found in the pagination section of the return statement of the base (or this) fuction.
    const mapPagesToTSX = (headers: PaginationHeader) => {
        let items = []
        for (let number = 1; number <= headers.TotalPages; number++) {
            items.push(
                <Pagination.Item onClick={() => {
                    handleClickNumber(number)
                }} key={number} active={number === headers.CurrentPage}>
                    {number}
                </Pagination.Item>,
            );
        }
        setPagination(<>{items}</>);

    }

    // handling of the most left pagination button (<<)
    const handleClickFirst = () => {
        let alteredRequestOptions = requestDAppOfferOptions;
        alteredRequestOptions.PageNumber = 1;
        setRequestDAppOfferOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the second pagination button (<)
    const handleClickPrevious = () => {
        let alteredRequestOptions = requestDAppOfferOptions;
        alteredRequestOptions.PageNumber = requestDAppOfferOptions.PageNumber - 1;
        setRequestDAppOfferOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the number in between (*)
    const handleClickNumber = (number: number) => {
        let alteredRequestOptions = requestDAppOfferOptions;
        alteredRequestOptions.PageNumber = number;
        setRequestDAppOfferOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the second to last pagination button (>)
    const handleClickNext = () => {
        let alteredRequestOptions = requestDAppOfferOptions;
        alteredRequestOptions.PageNumber = requestDAppOfferOptions.PageNumber + 1;
        setRequestDAppOfferOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the last pagination button (>>)
    const handleClickLast = () => {
        let alteredRequestOptions = requestDAppOfferOptions;
        alteredRequestOptions.PageNumber = headers.TotalPages;
        setRequestDAppOfferOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Check if button should be disabled or not
    const isPreviousDisabled = (): boolean => {
        return headers.HasPrevious === false;
    }

    // Check if button should be disabled or not
    const isNextDisabled = (): boolean => {
        return headers.HasNext === false;
    }

    // Apply filtering method. All fields are copied over to the {requestDAppOfferOptions}. Then this object is being used to do the API Call.
    const applyFiltering = () => {
        let alteredRequestOptions = requestDAppOfferOptions;
        //reset pagination
        alteredRequestOptions.PageNumber = 1

        //apply filtering on these fields
        alteredRequestOptions.SearchQuery = searchQ
        alteredRequestOptions.RegionQuery = regionQ
        alteredRequestOptions.MinReward = minReward
        alteredRequestOptions.MaxReward = maxReward

        setRequestDAppOfferOptions(alteredRequestOptions)

        handleLoadDelegates()
    }

    // Clears the filtering fields.
    const clearFilteringFields = () => {
        setSearchQ("")
        setRegionQ("")
        // @ts-ignore
        setMaxReward("")
        // @ts-ignore
        setMinReward("")
    }

    // on Change method
    const onSearchQueryChange = (event: any) => {
        setSearchQ(event.target.value);
    };

    // on Change method with a check if the value is {...}, if it is then pass an empty string.
    const onRegionQueryChange = (event: any) => {
        if (event.target.value === "...") {
            setRegionQ("");
        } else {
            setRegionQ(event.target.value);
        }
    };

    // on Change method with a check if the min price is higher than the max price. If it is then show an error.
    const onMinRewardChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }
        setMinReward(event.target.value)

        if (maxReward !== undefined && maxReward < event.target.value) {
            setShowError(true)
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    // on Change method with a check if the min price is higher than the max price. If it is then show an error.
    const onMaxRewardChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }
        setMaxReward(event.target.value)

        if (minReward !== undefined && minReward > event.target.value) {
            setShowError(true)
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    return (
        <div style={{marginTop: '30px'}}>
            <div>
                <h2>Dapps</h2>
                <p>On this page you can see the Dapps that seek new delegates. You can contact them by
                    clicking the contact button.</p>
            </div>
            <div>
                <h4>Filters</h4>
                {
                    showError
                        ? <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>
                                {errorMessage}
                            </p>
                        </Alert>
                        : <></>
                }
                <div className="row">
                    <div className="col-lg-3">
                        <Form.Group>
                            <Form.Label>Search (title):</Form.Label>
                            <Form.Control type="text" onChange={onSearchQueryChange} value={searchQ}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-3">
                        <Form.Group>
                            <Form.Label>Min reward: </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMinRewardChange} value={minReward}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-3">
                        <Form.Group>
                            <Form.Label>Max reward: </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMaxRewardChange} value={maxReward}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-3">
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Region:</Form.Label>
                            <Form.Control as="select" onChange={onRegionQueryChange} value={regionQ}>
                                <option>...</option>
                                <option>Europe</option>
                                <option>Asia</option>
                                <option>Africa</option>
                                <option>Oceania</option>
                                <option>North-America</option>
                                <option>South-America</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Button variant="primary" onClick={applyFiltering}>Apply filtering</Button> <Button
                        variant="secondary" onClick={clearFilteringFields}>Clear fields</Button>
                    </div>
                </div>
            </div>

            <div className="row">
                {dappCards}
            </div>
            <div style={{marginTop: "30px"}}>
                <Pagination>
                    <Pagination.First onClick={handleClickFirst} disabled={isPreviousDisabled()}/>
                    <Pagination.Prev onClick={handleClickPrevious} disabled={isPreviousDisabled()}/>
                    {pagination}
                    <Pagination.Next onClick={handleClickNext} disabled={isNextDisabled()}/>
                    <Pagination.Last onClick={handleClickLast} disabled={isNextDisabled()}/>
                </Pagination>
            </div>
        </div>
    );
}

export default DAppListOverview;