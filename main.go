package main

import (
	"database/sql"  //interface for querying/interacting with database
	"encoding/json" //for formatting/encoding/decoding json strings
	"fmt"
	"log"      //for logging problems/issues
	"net/http" //used for http requests/ http.ResponseWriter, *http.Request

	"github.com/go-sql-driver/mysql" //driver for mySQL connection
	"github.com/gorilla/handlers"    //works with net/http package to validate content types, allow access via CORS, compressing http responses
	"github.com/gorilla/mux"         //used to make handling multiple path variables/endpoint connections and related methods
)

type Product struct { //creating JSON object structure for DB retrieval
	ID       int    `json:"product_id"`
	Name     string `json:"product_name"`
	Desc     string `json:"descr"`
	Price    string `json:"price"` //fixed float32 -> float 64 as the shop was displaying 3.5 instead of 3.50
	Img      string `json:"imgurl"`
	Quantity int    `json:"quantity"`
}

type Customer struct { //need to restructure customer table/ break address into a seperate table
	ID        int    `json:"customer_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     int    `json:"phone"`
	City      string `json:"city"`
	State     string `json:"state"`
	Zip       int    `json:"zip"`
}

type AdminLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AdminLoginResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

type NewProductRequest struct {
	Name     string `json:"product_name"`
	Desc     string `json:"descr"`
	Price    string `json:"price"` //fixed float32 -> float 64 as the shop was displaying 3.5 instead of 3.50
	Img      string `json:"imgurl"`
	Quantity int    `json:"quantity"`
}

type NewProductResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

type Order struct {
	OrderID int `json:"order_id"`
	//Date       time.Time `json:"order_date"`
	CustomerID int    `json:"customer_id"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	//Products []Product `json:"products"`

}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProductRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	fmt.Print(err)

	if err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, "invalid request")
		return
	}

	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		panic(err)
	}

	defer db.Close()

	insertStatement, err := db.Prepare("INSERT INTO products (product_id, product_name, descr, price, imgurl, quantity) VALUES (?,?,?,?,?,?)")

	if err != nil {
		if err != nil {
			writeJSONErrorResponse(w, http.StatusUnauthorized, "invalid admin credentials")
			return
		}
	}

	defer insertStatement.Close()

	fmt.Print(request)
	_, err = insertStatement.Exec(0, request.Name, request.Desc, request.Price, request.Img, request.Quantity)

	if err != nil {
		panic(err.Error())
	}
}

func getAllCustomers(w http.ResponseWriter, r *http.Request) {
	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		panic(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT * FROM CUSTOMER")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	var customers []Customer

	for rows.Next() {
		var c Customer

		err := rows.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.City, &c.State, &c.Zip)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		customers = append(customers, c)

		w.Header().Set("Content-Type", "application/json") //setting header
		json.NewEncoder(w).Encode(customers)

	}
}

func getAllOrders(w http.ResponseWriter, r *http.Request) {
	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		panic(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT orders.order_id, customer.customer_id, customer.first_name, customer.last_name FROM orders INNER JOIN customer ON orders.customer_id = customer.customer_id;")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []Order

	for rows.Next() {
		var o Order
		err := rows.Scan(&o.OrderID, &o.CustomerID, &o.FirstName, &o.LastName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		orders = append(orders, o)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func getProducts(w http.ResponseWriter, r *http.Request) { //func to take in product info from DB and JSONify
	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		panic(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT product_id, product_name, descr, price, imgurl, quantity FROM products")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() { //for every row in products table..
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Desc, &p.Price, &p.Img, &p.Quantity)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		products = append(products, p)

	}
	//returning the product information as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func writeJSONErrorResponse(w http.ResponseWriter, statusCode int, errMessage string) { //method to reduce code repetition when returning a JSON formatted error response
	response := AdminLoginResponse{Success: false, Error: errMessage}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func adminLogin(w http.ResponseWriter, r *http.Request) { //on admin login request, verifies username and associated password are correct
	var request AdminLoginRequest

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, "invalid request")
		return
	}

	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "db connection error")
		return
	}

	defer db.Close()

	var storedPassword string

	err = db.QueryRow("SELECT password FROM admins WHERE username = ?", request.Username).Scan(&storedPassword)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusUnauthorized, "invalid admin credentials")
		return
	}

	if storedPassword == request.Password {
		response := AdminLoginResponse{Success: true}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	} else {
		writeJSONErrorResponse(w, http.StatusUnauthorized, "invalid password")
		return
	}
}
func handleRequest(corsMiddleware func(http.Handler) http.Handler) { //utilizing mux for handling multiple requests

	myRouter := mux.NewRouter().StrictSlash(true) //creating a new router instance to handle http requests, strict slash allows for /path/ and /path to be differentiated
	myRouter.Use(corsMiddleware)
	myRouter.HandleFunc("/getProducts", getProducts)
	myRouter.HandleFunc("/adminLogin", adminLogin)
	myRouter.HandleFunc("/allOrders", getAllOrders)
	myRouter.HandleFunc("/allCustomers", getAllCustomers)
	myRouter.HandleFunc("/addProduct", addProduct)

	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {
	//db, err := sql.Open("mysql", "root:Frodobaggins123@tcp(localhost:3306)/golang")

	corsMiddleware := handlers.CORS( //creates new CORS (Cross-Origin Resource Sharing) instance. Middleware for HTTP server allowing for specification on which origins, methods, and headers are allowed in cross-origin requests
		handlers.AllowedOrigins([]string{"http://localhost:5500"}),                   // allowing which domains can send requests to the server, company's would have their website here
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), //allowing all http methods
		handlers.AllowedHeaders([]string{"Content-Type"}),                            //specifying the header(s) allowed
	)

	handleRequest(corsMiddleware)
}

//mutex locking and unlocking***
