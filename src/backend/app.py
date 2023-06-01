from flask import Flask, request, jsonify
from dotenv import load_dotenv
from moralis import evm_api
import os

load_dotenv()

app = Flask(__name__)
api_key = os.getenv("MORALIS_API_KEY")
