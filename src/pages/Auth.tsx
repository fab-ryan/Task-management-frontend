import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { isAuthenticated, login } = useAuth();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // GraphQL Mutations
    const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.accessToken, data.login.refreshToken);
            toast({
                title: "Success",
                description: "You have been logged in successfully.",
                variant: "success",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const [register, { loading: registerLoading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            login(data.createUser.accessToken, data.createUser.refreshToken);
            toast({
                title: "Success",
                description: "Your account has been created successfully.",
                variant: "success",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginMutation({
                variables: {
                    email: loginData.email,
                    password: loginData.password,
                },
            });
        } catch (error) {
            // Error is handled by onError callback
            console.error('Login error:', error);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }
        try {
            await register({
                variables: {
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                },
            });
        } catch (error) {
            // Error is handled by onError callback
            console.error('Registration error:', error);
        }
    };

    const features = [
        {
            title: "Task Management",
            description: "Organize your tasks efficiently with our intuitive task management system",
        },
        {
            title: "Real-time Updates",
            description: "Stay in sync with your team with instant updates and notifications",
        },
        {
            title: "Progress Tracking",
            description: "Monitor your progress and achieve your goals with detailed analytics",
        },
        {
            title: "Team Collaboration",
            description: "Work seamlessly with your team members in a collaborative environment",
        },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left side - Auth Forms */}
            <div className="w-1/2 flex items-center justify-center p-8">
                <Card className="w-[450px]">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Choose your preferred sign in method
                        </CardDescription>
                    </CardHeader>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            placeholder="Enter your email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            placeholder="Enter your password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" disabled={loginLoading}>
                                        {loginLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister}>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Full Name</Label>
                                        <Input
                                            id="register-name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            placeholder="Enter your email"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Password</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            placeholder="Create a password"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-0"
                                            placeholder="Confirm your password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" disabled={registerLoading}>
                                        {registerLoading ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            {/* Right side - Features */}
            <div className="w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center transition-background duration-300 transform ">
                <div className="max-w-lg text-white">
                    <h2 className="text-3xl font-bold mb-8">Why Join Us?</h2>
                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-blue-100">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 