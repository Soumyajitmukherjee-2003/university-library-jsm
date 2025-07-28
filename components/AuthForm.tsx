"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast({
        title: "Success",
        description: isSignIn
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      });
      router.push("/");
    } else {
      form.setError("root", { message: result.error || "Unknown error" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {Object.entries(defaultValues).map(([key]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof T}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white" htmlFor={key}>
                    {FIELD_NAMES[key as keyof typeof FIELD_NAMES] ?? key}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={key}
                      type={
                        FIELD_TYPES[key as keyof typeof FIELD_TYPES] ?? "text"
                      }
                      className="bg-dark-200 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {form.formState.errors.root && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : isSignIn
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-white text-center">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-primary underline"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
