import { toast } from "react-toastify";
import { apiUrl, toastOptions } from "../conf/conf";

export class UserService {
    async register(formData) {
        const response = await fetch(`${apiUrl}/user/register`, {
            method: "POST",
            body: formData,
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async login(email, password) {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });

        const { success, token, user, message } = await response.json();

        if (success) {
            localStorage.setItem("token", token);
            toast.success(message, toastOptions);
            return user;
        } else toast.error(message, toastOptions);

        return success;
    }

    async profile() {
        const token = localStorage.getItem("token");
        if (!token) return false;
        const response = await fetch(`${apiUrl}/user/profile`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message, user } = await response.json();

        if (success) return user;
        return false;
    }

    async updateProfile(formData) {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await fetch(`${apiUrl}/user/profile`, {
            method: "PUT",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
        });

        const { success, message, updatedProfile } = await response.json();
        if (success) {
            toast.success(message, toastOptions);
            return updatedProfile;
        } else toast.error(message, toastOptions);

        return false;
    }

    async changePassword(oldPassword, newPassword, confirmPassword) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/change-password`, {
            method: "POST",
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();

        if (success) {
            localStorage.removeItem("token", token);
            toast.success(message, toastOptions);
        } else toast.error(message, toastOptions);

        return success;
    }

    async forgotPassword(email) {
        const response = await fetch(`${apiUrl}/user/forgot-password`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
        });

        const { success, message } = await response.json();

        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async resetPassword(token, newPassword, confirmPassword) {
        const response = await fetch(`${apiUrl}/user/reset-password`, {
            method: "POST",
            body: JSON.stringify({ token, newPassword, confirmPassword }),
            headers: { "Content-Type": "application/json" },
        });

        const { success, message } = await response.json();

        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async listChats() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/chat`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, chats } = await response.json();

        if (success) return chats;
        else return false;
    }

    async accessChat(userId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/chat`, {
            method: "POST",
            body: JSON.stringify({ userId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, chat } = await response.json();

        if (success) return chat;
        else return false;
    }

    async searchFriends(search) {
        const token = localStorage.getItem("token");

        let url = `${apiUrl}/user/search?`;
        if (search) url += `search=${search}`;

        const response = await fetch(url, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, users } = await response.json();

        if (success) return users;
        else return false;
    }

    async getNotifications() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friend-requests`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, requests } = await response.json();

        if (success) return requests;
        else return false;
    }

    async sendRequest(receiverId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friend-requests`, {
            method: "POST",
            body: JSON.stringify({ receiverId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message, newRequest } = await response.json();

        if (success) {
            toast.success(message, toastOptions);
            return newRequest;
        } else toast.error(message, toastOptions);

        return success;
    }

    async removeRequest(requestId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friend-requests/remove`, {
            method: "DELETE",
            body: JSON.stringify({ requestId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message, request } = await response.json();

        if (success) {
            toast.success(message, toastOptions);
            return request;
        } else toast.error(message, toastOptions);

        return success;
    }

    async acceptRequest(requestId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friend-requests/accept`, {
            method: "PATCH",
            body: JSON.stringify({ requestId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();

        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async rejectRequest(requestId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friend-requests/reject`, {
            method: "DELETE",
            body: JSON.stringify({ requestId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();

        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async listFriends() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friends`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, friends } = await response.json();

        if (success) return friends;
        else return false;
    }

    async removeFriend(requestId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/friends`, {
            method: "DELETE",
            body: JSON.stringify({ requestId }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message, friend } = await response.json();

        if (success) {
            toast.success(message, toastOptions);
            return friend;
        } else toast.error(message, toastOptions);

        return false;
    }

    async listMessages(chatId) {
        const token = localStorage.getItem("token");

        const result = await fetch(`${apiUrl}/message/${chatId}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, messages } = await result.json();
        if (success) return messages;
        else return false;
    }

    async addMessage(chatId, content) {
        const token = localStorage.getItem("token");

        const result = await fetch(`${apiUrl}/message`, {
            method: "POST",
            body: JSON.stringify({ chatId, content }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const { success, message, chat } = await result.json();
        if (success) return { message, chat };
        else return false;
    }
}

export const userService = new UserService();
