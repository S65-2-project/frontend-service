import React, {useEffect} from "react";
import {PaginationHeader, DelegateOffer, RequestDelegateOffersOptions, DelegateOfferUser} from "./types/DelegateOffer";
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Button from "react-bootstrap/Button";
import './DelegateListOverview.css'
import ListGroup from "react-bootstrap/ListGroup";
import {Link} from "react-router-dom";
import config from '../config.json';
import Pagination from "react-bootstrap/Pagination";
import {Form} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import CreateChat from "../types/CreateChat";
import {connect} from "react-redux";
import {withRouter} from "react-router";

const DelegateListOverview = (props : any) => {

    // HTML Objects
    const [delegateCards, setDelegateCards] = React.useState(<></>);
    const [pagination, setPagination] = React.useState(<></>);

    // Validation error
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // Filtering fields
    const [searchQ, setSearchQ] = React.useState<string>('');
    const [regionQ, setRegionQ] = React.useState<string>('');
    const [maxPrice, setMaxPrice] = React.useState<number | undefined>(undefined);
    const [minPrice, setMinPrice] = React.useState<number | undefined>(undefined);
    const [minMonth, setMinMonth] = React.useState<number | undefined>(undefined);
    const [maxMonth, setMaxMonth] = React.useState<number | undefined>(undefined);

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
    const [requestDelegateOffersOptions, setRequestDelegateOffersOptions] = React.useState<RequestDelegateOffersOptions>({
        MaxMonth: undefined,
        MaxPrice: undefined,
        MinMonth: undefined,
        MinPrice: undefined,
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
        setDelegateCards(<div className="col-lg-4 d-flex align-items-stretch" style={{marginTop: '30px'}}><Spinner animation="border" variant="primary"/></div>);

        loadDelegates(requestDelegateOffersOptions).then(r => {
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
    const loadDelegates = async (reqOptions: RequestDelegateOffersOptions) => {
        // Request headers and other parameters
        const requestOptions: any = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: "cors",
            cache: "default",
        };

        // Bare minimum URL
        let url = `${config.SERVICES.DELEGATE}?PageNumber=${reqOptions?.PageNumber.toString()}&PageSize=${reqOptions?.PageSize}`

        // Additional components based on if they are populated or not
        if (reqOptions.MaxMonth) url += `&MaxMonth=${reqOptions.MaxMonth}`
        if (reqOptions.MinMonth) url += `&MinMonth=${reqOptions.MinMonth}`
        if (reqOptions.MaxPrice) url += `&MaxPrice=${reqOptions.MaxPrice}`
        if (reqOptions.MinPrice) url += `&MinPrice=${reqOptions.MinPrice}`
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
    const mapJsonToTSX = (json: DelegateOffer[]) => {
        let mappedItems = json.map((item, key) => {
            return <div className="col-lg-4 d-flex align-items-stretch" style={{marginTop: '30px'}} key={item.id}>
                <Card className="card-styling card-hover" border="secondary" bg="light" style={{width: '100%'}}>
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Made by <i><Link
                            to={{pathname: "/profile/" + item.provider.id}}>{item.provider.email}</Link></i></Card.Subtitle>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item variant="secondary">Region:
                            <b> {item.region}</b> </ListGroup.Item>
                        <ListGroup.Item variant="secondary">Available
                            for <b> {item.availableForInMonths}</b> months</ListGroup.Item>
                        <ListGroup.Item variant="primary">Price: <b>{item.liskPerMonth}</b> Lisk per month  </ListGroup.Item>
                    </ListGroup>
                    {(props.auth.User.token !== '' && props.auth.User.id !== item.provider.id) &&
                    <Card.Footer style={{height: '100px'}}>
                        <Button variant="primary" onClick={() => {
                            initializeChat(item.provider)
                        }}>Start de chat!</Button>
                    </Card.Footer>
                    }
                    {(props.auth.User.token !== '' && props.auth.User.id === item.provider.id) &&
                    <Card.Footer style={{height: '100px'}}>
                        <Button variant="primary" onClick={() => {
                            props.history.push("/update-delegate/" + item.id)
                        }}>Update offer</Button>
                    </Card.Footer>
                    }
                </Card>
            </div>
        })

        setDelegateCards(<>{mappedItems}</>)
    }

    // Startchat button, starts a chat and redirects user to the chat window
    const initializeChat = async (seller: DelegateOfferUser) => {
        let buyer : DelegateOfferUser = {
            id : props.auth.User.id,
            email : props.auth.User.email
        }

        let createChat: CreateChat = {
          buyer : buyer,
          seller : seller
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
            setShowError(true)
            setErrorMessage(JSON.stringify(await response.json()))
        }
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
        let alteredRequestOptions = requestDelegateOffersOptions;
        alteredRequestOptions.PageNumber = 1;
        setRequestDelegateOffersOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the second pagination button (<)
    const handleClickPrevious = () => {
        let alteredRequestOptions = requestDelegateOffersOptions;
        alteredRequestOptions.PageNumber = requestDelegateOffersOptions.PageNumber - 1;
        setRequestDelegateOffersOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the number in between (*)
    const handleClickNumber = (number: number) => {
        let alteredRequestOptions = requestDelegateOffersOptions;
        alteredRequestOptions.PageNumber = number;
        setRequestDelegateOffersOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the second to last pagination button (>)
    const handleClickNext = () => {
        let alteredRequestOptions = requestDelegateOffersOptions;
        alteredRequestOptions.PageNumber = requestDelegateOffersOptions.PageNumber + 1;
        setRequestDelegateOffersOptions(alteredRequestOptions);
        handleLoadDelegates()
    }

    // Handling of the last pagination button (>>)
    const handleClickLast = () => {
        let alteredRequestOptions = requestDelegateOffersOptions;
        alteredRequestOptions.PageNumber = headers.TotalPages;
        setRequestDelegateOffersOptions(alteredRequestOptions);
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

    // Apply filtering method. All fields are copied over to the {requestDelegateOffersOptions}. Then this object is being used to do the API Call.
    const applyFiltering = () => {
        let alteredRequestOptions = requestDelegateOffersOptions;
        //reset pagination
        alteredRequestOptions.PageNumber = 1

        //apply filtering on these fields
        alteredRequestOptions.SearchQuery = searchQ
        alteredRequestOptions.RegionQuery = regionQ
        alteredRequestOptions.MinPrice = minPrice
        alteredRequestOptions.MaxPrice = maxPrice
        alteredRequestOptions.MinMonth = minMonth
        alteredRequestOptions.MaxMonth = maxMonth

        setRequestDelegateOffersOptions(alteredRequestOptions)

        handleLoadDelegates()
    }

    // Clears the filtering fields.
    const clearFilteringFields = () => {
        setSearchQ("")
        setRegionQ("")
        // @ts-ignore
        setMaxPrice("")
        // @ts-ignore
        setMinPrice("")
        // @ts-ignore
        setMaxMonth("")
        // @ts-ignore
        setMinMonth("")
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
    const onMinPriceChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }
        setMinPrice(event.target.value)

        if (maxPrice !== undefined && maxPrice < event.target.value) {
            setShowError(true)
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    // on Change method with a check if the min price is higher than the max price. If it is then show an error.
    const onMaxPriceChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }
        setMaxPrice(event.target.value)

        if (minPrice !== undefined && minPrice > event.target.value) {
            setShowError(true)
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    // on Change method with a check if the min availability is higher than the max availability. If it is then show an error.
    const onMinAvailabilityChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }

        setMinMonth(event.target.value);


        if (maxMonth !== undefined && maxMonth < event.target.value) {
            setShowError(true);
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    // on Change method with a check if the min availability is higher than the max availability. If it is then show an error.
    const onMaxAvailabilityChange = (event: any) => {
        if(event.target.value < 0){
            event.target.value =0;
        }
        setMaxMonth(event.target.value)

        if (minMonth !== undefined && minMonth > event.target.value) {
            setShowError(true)
            setErrorMessage("Please check that the minimal price or availability is less than the maximum price or availability!")
        } else {
            setShowError(false)
        }
    }

    return (
        <div style={{marginTop: '30px'}}>
            <div>
                <h2>Delegate offers</h2>
                <p>On this page the delegates that offer to be used by sidechains are shown. You can contact them by
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
                    <div className="col-lg-4">
                        <Form.Group>
                            <Form.Label>Search (Title):</Form.Label>
                            <Form.Control type="text" onChange={onSearchQueryChange} value={searchQ}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group>
                            <Form.Label>Min price: </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMinPriceChange} value={minPrice}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group>
                            <Form.Label>Max price: </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMaxPriceChange} value={maxPrice}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
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
                        <Form.Group>
                            <Form.Label>Minimal availability (Months): </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMinAvailabilityChange}
                                          value={minMonth}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group>
                            <Form.Label>Maximal availability (Months): </Form.Label>
                            <Form.Control type="number" min="0" onChange={onMaxAvailabilityChange}
                                          value={maxMonth}/>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Button variant="primary" onClick={applyFiltering}>Apply filtering</Button> <Button
                        variant="secondary" onClick={clearFilteringFields}>Clear fields</Button>
                    </div>
                </div>
            </div>

            <div className="row">
                {delegateCards}
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

const mapStateToProps = (state : any) => {
    return {
        auth : state.auth
    };
}

export default withRouter(connect(mapStateToProps)(DelegateListOverview));