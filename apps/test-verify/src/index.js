"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from "express";
// import * as bodyParser from "body-parser";
// import {
//   compileRootHash,
//   compileHashAddresses,
//   generateMerkleProof,
//   makeMerkelRootFromProof,
// } from "../services";
// import { PrismaClient } from "@prisma/client";
// import crypto from "crypto";
// import { ethers } from "hardhat";
var axios_1 = require("axios");
// import data from '../data.json'
var fs = require("fs");
// const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var good, bad, startTime, t, halfTime, requestId, u, endTime, stop_1, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    good = 0;
                    bad = 0;
                    startTime = new Date();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/verify-trustanchor/0x82Ab68099eed0b1276bcacdBbf31B3Cc7563960A")];
                case 2:
                    t = _b.sent();
                    halfTime = new Date();
                    requestId = Number((_a = t === null || t === void 0 ? void 0 : t.data) === null || _a === void 0 ? void 0 : _a.requestid);
                    return [4 /*yield*/, axios_1.default.post("http://45.76.124.221/verify/".concat(requestId), {
                            holderWallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                            issuerAddress: "0x9A676e781A523b5d0C0e43731313A708CB607508",
                            data: {
                                type: "Buffer",
                                data: [
                                    96, 207, 56, 207, 127, 195, 101, 16, 132, 47, 147, 225, 115, 169, 77,
                                    82, 70, 69, 114, 189, 0, 66, 6, 249, 136, 253, 23, 115, 88, 156, 194,
                                    139, 97, 175, 170, 32, 173, 60, 108, 200, 8, 45, 249, 227, 70, 15,
                                    231, 247, 218, 129, 117, 171, 238, 161, 153, 74, 211, 6, 254, 149, 85,
                                    211, 3, 255, 73, 219, 150, 155, 137, 162, 191, 220, 138, 43, 175, 217,
                                    148, 184, 185, 19, 216, 17, 102, 28, 187, 136, 35, 170, 40, 62, 239,
                                    151, 234, 100, 12, 45, 226, 55, 200, 76, 73, 26, 250, 57, 243, 21,
                                    169, 140, 78, 49, 224, 160, 246, 72, 228, 123, 119, 188, 245, 49, 131,
                                    111, 194, 223, 78, 65, 244, 199, 14, 5, 236, 217, 207, 82, 205, 132,
                                    172, 107, 1, 186, 3, 180, 218, 238, 1, 82, 172, 237, 84, 76, 18, 13,
                                    16, 189, 176, 78, 196, 75, 247, 110, 73, 146, 120, 156, 215, 35, 55,
                                    227, 51, 73, 55, 236, 228, 129, 102, 85, 79, 5, 171, 46, 12, 109, 148,
                                    124, 218, 69, 173, 65, 0, 216, 3, 251, 209, 239, 101, 180, 38, 139,
                                    225, 182, 175, 72, 40, 29, 89, 50, 219, 78, 129, 95, 20, 69, 241, 235,
                                    110, 91, 163, 45, 174, 71, 224, 190, 207, 142, 19, 246, 21, 167, 167,
                                    137, 32, 5, 187, 222, 22, 195, 97, 25, 113, 49, 116, 86, 62, 243, 198,
                                    81, 101, 217, 195, 230, 174, 63, 154, 227, 15, 77, 31, 63, 43, 232,
                                    56, 140, 242, 65, 72, 254, 230, 150, 19, 60, 58, 219, 150, 16, 166,
                                    69, 189, 10, 219, 14, 135, 109, 135, 166, 210, 128, 13, 242, 131, 108,
                                    133, 170, 17, 34, 21, 124, 142, 206, 119, 194, 14, 97, 211, 115, 35,
                                    55, 160, 48, 10, 4, 234, 168, 180, 247, 56, 178, 122, 101, 244, 243,
                                    73, 5, 176, 80, 226, 222, 194, 105, 123, 173, 87, 30, 204, 68, 75, 47,
                                    253, 191, 245, 145, 64, 72, 105, 40, 175, 202, 172, 78, 117, 121, 140,
                                    85, 95, 122, 214, 111, 47, 19, 161, 203, 8, 198, 44, 30, 0, 5, 176,
                                    32, 13, 244, 116, 132, 163, 163, 182, 195, 57, 32, 125, 40, 197, 229,
                                    238, 175, 243, 24, 228, 252, 84, 122, 58, 252, 25, 113, 98, 162, 82,
                                    49, 244, 177, 24, 81, 223, 49, 17, 236, 246, 108, 127, 248, 34, 227,
                                    92, 195, 145, 220, 89, 166, 247, 55, 74, 174, 15, 6, 47, 224, 101,
                                    193, 96, 191, 57, 160, 121, 169, 199, 83, 166, 242, 129, 185, 100, 23,
                                    26, 126, 53, 118, 99, 152, 122, 242, 135, 7, 30, 51, 55, 248, 174, 22,
                                    31, 239, 211, 168, 44, 77, 151, 67, 26, 137, 191, 220, 188, 238, 118,
                                    245, 141, 84, 160, 179, 67, 250, 133, 176, 161, 75, 154, 225, 62, 8,
                                    220, 124, 151, 216, 88, 116, 238, 49, 134, 194, 240, 185, 192, 85,
                                    108, 213, 128, 184, 191, 254, 183, 8, 166, 92,
                                ],
                            },
                        })];
                case 3:
                    u = _b.sent();
                    endTime = new Date();
                    stop_1 = new Date().getTime() - startTime.getTime();
                    console.log("stop", stop_1);
                    fs.appendFileSync("./result.txt", "[".concat(200, ", ").concat(halfTime.getTime() - startTime.getTime(), ", ").concat(endTime.getTime() - halfTime.getTime(), ", ").concat(stop_1, ", 1]\n"));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.log(error_1);
                    fs.appendFileSync("./result.txt", "[".concat(200, ", ").concat(0, ", 0, 0, 0]\n"));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
